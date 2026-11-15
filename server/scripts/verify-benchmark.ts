import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(serverDir, "..");

loadEnv({ path: path.join(projectRoot, ".env") });
loadEnv({ path: path.join(serverDir, ".env"), override: true });

async function verify() {
  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey) {
    console.error("FAIL: METALS_DEV_API_KEY is not set in environment or .env file.");
    process.exit(1);
  }

  console.log("Calling Metals.dev Authority API with authority=ibja...");
  try {
    const ibjaUrl = `https://api.metals.dev/v1/metal/authority?currency=INR&unit=g&authority=ibja&api_key=${apiKey}`;
    const ibjaRes = await fetch(ibjaUrl);
    const ibjaText = await ibjaRes.text();
    console.log(`IBJA Status: ${ibjaRes.status}`);
    console.log("IBJA Raw JSON:");
    console.log(ibjaText);

    console.log("\nCalling Metals.dev Authority API with authority=mcx...");
    const mcxUrl = `https://api.metals.dev/v1/metal/authority?currency=INR&unit=g&authority=mcx&api_key=${apiKey}`;
    const mcxRes = await fetch(mcxUrl);
    const mcxText = await mcxRes.text();
    console.log(`MCX Status: ${mcxRes.status}`);
    console.log("MCX Raw JSON:");
    console.log(mcxText);
  } catch (err) {
    console.error("FAIL: Error calling Metals.dev:", err);
    process.exit(1);
  }
}

verify();
