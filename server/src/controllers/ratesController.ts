import type { Request, Response } from "express";
import { ratesService } from "../services/ratesService.js";

export async function getLiveRates(_req: Request, res: Response): Promise<void> {
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=900");

  const rates = await ratesService.getRates();

  if (!rates) {
    res.status(503).json({ available: false });
    return;
  }

  res.json(rates);
}
