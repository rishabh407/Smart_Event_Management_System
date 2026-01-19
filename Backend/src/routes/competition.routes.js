import express from "express";
import { createCompetition } from "../controllers/competition.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create competition (Coordinator only → checked inside controller)
router.post("/", protect, createCompetition);

export default router;
