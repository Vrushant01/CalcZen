import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Load calculator slugs from src/data/calculators.ts
const calcFile = fs.readFileSync('src/data/calculators.ts', 'utf8');
const calcArrayText = calcFile.slice(calcFile.indexOf('export const calculators: CalculatorMeta[] = ['));
const slugMatches = [...calcArrayText.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
const uniqueSlugs = [...new Set(slugMatches)];

console.log(`Loaded ${uniqueSlugs.length} calculator slugs to audit.\n`);

const PORT = 4173;
const CHROME_PORT = 9222;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch {
      // wait
    }
    await sleep(200);
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runAudit() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-'));

  // 1. Start vite preview
  console.log('Starting Vite preview server...');
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  preview.stderr.on('data', data => {
    // console.error(`[preview stderr] ${data}`);
  });

  // 2. Start Chrome
  console.log('Starting headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions'
  ]);

  try {
    await waitForServer(`http://127.0.0.1:${PORT}`);
    console.log(`Vite preview ready on port ${PORT}`);

    await waitForServer(`http://127.0.0.1:${CHROME_PORT}/json/version`);
    console.log(`Chrome debugging port ready on ${CHROME_PORT}\n`);

    const listRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/list`);
    const pages = await listRes.json();
    const wsUrl = pages[0].webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    let nextId = 1;
    const callbacks = new Map();
    let currentExceptions = [];
    let currentConsoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails?.exception?.description ||
                     msg.params.exceptionDetails?.text ||
                     'Unknown exception';
        currentExceptions.push(desc);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const args = msg.params.args.map(a => a.value || a.description || '').join(' ');
          currentConsoleErrors.push(args);
        }
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = nextId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Runtime.enable');
    await sendCommand('Page.enable');

    const results = [];

    console.log('Starting audit of all calculators...\n');

    for (let i = 0; i < uniqueSlugs.length; i++) {
      const slug = uniqueSlugs[i];
      const targetUrl = `http://127.0.0.1:${PORT}/calculator/${slug}`;
      process.stdout.write(`[${i + 1}/${uniqueSlugs.length}] ${slug} ... `);

      currentExceptions = [];
      currentConsoleErrors = [];

      // Navigate to route
      await sendCommand('Page.navigate', { url: targetUrl });
      await sleep(1000); // Allow react hydration and component mount

      // Check if TanStack Error boundary or crash banner triggered
      const pageState = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const bodyText = document.body.innerText || '';
          const hasCrash = bodyText.includes("This page didn't load") ||
                           bodyText.includes("Something went wrong on our end");
          return {
            hasCrash,
            title: document.title,
            bodySnippet: bodyText.slice(0, 200)
          };
        })()`,
        returnByValue: true
      });

      let clickInfo = { clicked: false, note: '' };

      // Try clicking Calculate button
      const clickRes = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const btn = buttons.find(b => {
            const txt = (b.textContent || '').toLowerCase();
            return (txt.includes('calculate') || txt.includes('compute')) && !txt.includes('reset');
          }) || buttons.find(b => b.getAttribute('type') === 'submit');

          if (!btn) return { clicked: false, note: 'Button not found' };
          if (btn.disabled) return { clicked: false, note: 'Button disabled' };

          btn.click();
          return { clicked: true, note: (btn.textContent || '').trim().slice(0, 30) };
        })()`,
        returnByValue: true
      });

      if (clickRes?.result?.result?.value) {
        clickInfo = clickRes.result.result.value;
      }

      await sleep(500); // Wait for calculation and re-render

      // Collect any uncaught errors
      const fatalErrors = [
        ...currentExceptions,
        ...currentConsoleErrors.filter(e =>
          e.includes('ReferenceError') ||
          e.includes('TypeError') ||
          e.includes('before initialization') ||
          e.includes('Cannot read properties')
        )
      ];

      const crashed = pageState?.result?.result?.value?.hasCrash || fatalErrors.length > 0;

      if (crashed) {
        const errorMsg = fatalErrors.join(' | ') || 'Page showed crash fallback';
        console.log(`❌ FAIL`);
        console.log(`    Error: ${errorMsg}`);
        results.push({ slug, status: 'FAIL', error: errorMsg, clickInfo });
      } else {
        console.log(`✅ PASS (Click: ${clickInfo.clicked ? clickInfo.note : clickInfo.note || 'None'})`);
        results.push({ slug, status: 'PASS', error: null, clickInfo });
      }
    }

    console.log('\n=================================================');
    console.log('AUDIT SUMMARY');
    console.log('=================================================');
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    console.log(`Total Calculators Audited: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailed Calculators:');
      for (const r of results.filter(r => r.status === 'FAIL')) {
        console.log(`  - ${r.slug}: ${r.error}`);
      }
    } else {
      console.log('\nAll calculators loaded and calculated with 0 runtime errors!');
    }

    try { ws.close(); } catch {}
    try { chrome.kill(); } catch {}
    try { preview.kill(); spawn('taskkill', ['/pid', String(preview.pid), '/f', '/t'], { shell: true }); } catch {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    process.exit(failed > 0 ? 1 : 0);
  } finally {
    try { ws?.close(); } catch {}
    try { chrome?.kill(); } catch {}
    try { preview?.kill(); spawn('taskkill', ['/pid', String(preview.pid), '/f', '/t'], { shell: true }); } catch {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
