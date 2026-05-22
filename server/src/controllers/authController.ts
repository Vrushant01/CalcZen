import bcrypt from "bcryptjs";
import type { Response } from "express";
import { findAdminByEmail } from "../services/adminService.js";
import { signToken, type AuthRequest } from "../middleware/auth.js";

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const admin = await findAdminByEmail(email);
  if (!admin) {
    res.status(401).json({ success: false, message: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, message: "Invalid email or password" });
    return;
  }

  const token = signToken(admin._id, admin.email);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    },
  });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  res.json({
    success: true,
    data: {
      id: req.admin!._id,
      email: req.admin!.email,
      name: req.admin!.name,
    },
  });
}
