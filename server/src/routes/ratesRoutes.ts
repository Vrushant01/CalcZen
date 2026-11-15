import { Router } from "express";
import { getLiveRates } from "../controllers/ratesController.js";

const router = Router();

router.get("/", getLiveRates);

export default router;
