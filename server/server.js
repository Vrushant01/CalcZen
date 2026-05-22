/**
 * CalcZen API — production entry (Render: node server.js)
 * Loads TypeScript from src/ at runtime (no dist/ compile step).
 */
import "tsx/esm";
await import("./src/index.ts");
