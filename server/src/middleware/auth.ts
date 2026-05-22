import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { findAdminById } from "../services/adminService.js";
import type { ApiAdmin } from "../types/database.js";

export interface AuthPayload {
  adminId: string;
  email: string;
}

export interface AuthRequest extends Request {
  admin?: ApiAdmin;
  auth?: AuthPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export async function attachAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.auth?.adminId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const admin = await findAdminById(req.auth.adminId);
  if (!admin) {
    res.status(401).json({ success: false, message: "Admin not found" });
    return;
  }

  req.admin = admin;
  next();
}

export function signToken(adminId: string, email: string): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ adminId, email }, env.jwtSecret, options);
}
