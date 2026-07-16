import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Resolve uploads path inside process.cwd()
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads/blog");
const OG_DIR = path.resolve(process.cwd(), "uploads/og");

/**
 * Downloads an external image or decodes a base64 DataURL, converts it to optimized WebP format,
 * resizes it to multiple widths (1200px, 800px, 400px), and saves it locally.
 * Returns the local relative path from root.
 */
export async function optimizeAndStoreImage(imageUrl: string, slug: string): Promise<string> {
  if (!imageUrl) return "";

  // Skip if it's already an optimized local path
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  // Skip localhost or calczen domains if they are already local files
  if (
    (imageUrl.includes("calczen.in") || imageUrl.includes("localhost")) &&
    !imageUrl.startsWith("data:") &&
    imageUrl.includes("/uploads/")
  ) {
    const match = imageUrl.match(/(\/uploads\/.*)$/);
    if (match) return match[1];
  }

  try {
    let buffer: Buffer;

    if (imageUrl.startsWith("data:")) {
      console.log(`[IMAGE OPTIMIZER] Decoding base64 image data URL...`);
      const match = imageUrl.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        throw new Error("Invalid base64 data URL format");
      }
      buffer = Buffer.from(match[2], "base64");
    } else {
      console.log(`[IMAGE OPTIMIZER] Downloading external image: ${imageUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch image (HTTP ${response.status})`);
      }

      buffer = Buffer.from(await response.arrayBuffer());
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      try {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      } catch {}
    }

    const baseFilename = `${slug}.webp`;
    const destPath = path.join(UPLOADS_DIR, baseFilename);

    console.log(`[IMAGE OPTIMIZER] Converting and saving WebP to: ${destPath}`);

    // Generate main 1200px width WebP (Discover ready)
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat("webp", { quality: 82 })
      .toFile(destPath);

    // Generate smaller sizes for responsive srcsets
    const sizes = [800, 400];
    for (const size of sizes) {
      const sizeFilename = `${slug}-${size}.webp`;
      const sizeDestPath = path.join(UPLOADS_DIR, sizeFilename);
      await sharp(buffer)
        .resize({ width: size, withoutEnlargement: true })
        .toFormat("webp", { quality: 82 })
        .toFile(sizeDestPath);
    }

    return `/uploads/blog/${baseFilename}`;
  } catch (err: any) {
    console.error(`[IMAGE OPTIMIZER] Error optimizing image:`, err.message);
    return imageUrl;
  }
}

/**
 * Generates a branded OpenGraph image (1200x630 WebP) automatically using a dynamic SVG.
 */
export async function generateOgImage(title: string, slug: string): Promise<string> {
  const width = 1200;
  const height = 630;

  // Split title into lines for multi-line support in SVG text
  const words = title.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).length > 25) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += " " + word;
    }
  }
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  // Pick up to 3 lines
  const displayLines = lines.slice(0, 3);
  const textElements = displayLines.map((line, idx) => {
    const y = 280 + idx * 75;
    return `<text x="100" y="${y}" fill="#F8FAFC" font-family="sans-serif" font-size="54" font-weight="bold">${escapeXml(line)}</text>`;
  }).join("\n");

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#311042;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)" />
  
  <path d="M 0,105 L 1200,105 M 0,210 L 1200,210 M 0,315 L 1200,315 M 0,420 L 1200,420 M 0,525 L 1200,525 M 100,0 L 100,630 M 200,0 L 200,630 M 350,0 L 350,630 M 500,0 L 500,630 M 700,0 L 700,630 M 900,0 L 900,630 M 1100,0 L 1100,630" fill="none" stroke="#334155" stroke-opacity="0.15" stroke-width="1" />
  
  <rect x="0" y="0" width="1200" height="10" fill="#6366F1" />
  
  <rect x="100" y="80" width="160" height="40" rx="8" fill="#4f46e5" fill-opacity="0.2" stroke="#6366F1" stroke-width="1" />
  <text x="120" y="106" fill="#818CF8" font-family="sans-serif" font-size="18" font-weight="bold">CalcZen Guide</text>
  
  ${textElements}
  
  <text x="100" y="550" fill="#818CF8" font-family="sans-serif" font-size="28" font-weight="bold">CalcZen</text>
  <text x="220" y="548" fill="#475569" font-family="sans-serif" font-size="20">|</text>
  <text x="240" y="548" fill="#94A3B8" font-family="sans-serif" font-size="20">Smart Financial &amp; Math Tools</text>
</svg>
  `.trim();

  // Ensure uploads/og directory exists
  if (!fs.existsSync(OG_DIR)) {
    try {
      fs.mkdirSync(OG_DIR, { recursive: true });
    } catch {}
  }

  const destPath = path.join(OG_DIR, `${slug}.webp`);
  
  try {
    await sharp(Buffer.from(svg))
      .toFormat("webp", { quality: 85 })
      .toFile(destPath);
    return `/uploads/og/${slug}.webp`;
  } catch (err) {
    console.error(`[IMAGE OPTIMIZER] Failed to generate OG image for ${slug}:`, err);
    return "/icons/android-chrome-512x512.png";
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}
