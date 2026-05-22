import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "../..");
const projectRoot = path.resolve(serverDir, "..");

loadEnv({ path: path.join(projectRoot, ".env") });
loadEnv({ path: path.join(serverDir, ".env"), override: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  /** Prefer service role on server; falls back to anon key */
  supabaseKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  siteUrl: process.env.SITE_URL ?? "http://localhost:5173",
  siteName: process.env.SITE_NAME ?? "CalcZen",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "hello@calczen.in",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  emailBatchSize: Number(process.env.EMAIL_BATCH_SIZE ?? 50),
};

export function assertProductionEnv(): void {
  if (env.nodeEnv === "production") {
    if (!hasDbConfig()) throw new Error("SUPABASE_URL and Supabase key are required in production");
    if (env.jwtSecret === "change-me-in-production") {
      throw new Error("JWT_SECRET must be set in production");
    }
    if (!hasEmailConfig()) {
      console.warn("RESEND_API_KEY not set — emails will be disabled in production.");
    }
  }
}

export function hasEmailConfig(): boolean {
  return Boolean(env.resendApiKey && env.emailFrom);
}

export function hasDbConfig(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseKey);
}

export { required };
