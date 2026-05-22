import type { NextFunction, Request, Response } from "express";

/** Strip MongoDB operator keys ($) and dotted keys from user input. Express 5–compatible. */
function sanitizeInPlace(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = sanitizeInPlace(value[i]);
    }
    return value;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of [...Object.keys(obj)]) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
        continue;
      }
      obj[key] = sanitizeInPlace(obj[key]);
    }
    return obj;
  }

  if (typeof value === "string" && value.includes("$")) {
    return value.replace(/\$/g, "");
  }

  return value;
}

export function mongoSanitize(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    sanitizeInPlace(req.body);
  }

  if (req.query && typeof req.query === "object") {
    sanitizeInPlace(req.query);
  }

  if (req.params && typeof req.params === "object") {
    sanitizeInPlace(req.params);
  }

  next();
}
