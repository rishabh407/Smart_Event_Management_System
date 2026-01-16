import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { registerIndividual, registerTeam } from "../controllers/registration.controller.js";

const router = express.Router();

// Individual competition
router.post("/individual", protect, registerIndividual);

// Team competition
router.post("/team", protect, registerTeam);

export default router;
