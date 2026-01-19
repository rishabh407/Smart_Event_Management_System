import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  registerIndividual,
  registerTeam,
} from "../controllers/registration.controller.js";

const router = express.Router();

// Student registers for individual competition
router.post("/individual", protect, registerIndividual);

// Team leader registers team
router.post("/team", protect, registerTeam);

export default router;

