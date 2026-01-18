import express from "express";
import {
  createCompetition,
  getCompetitionsByEvent,
  getCompetitionById,
} from "../controllers/competition.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { specialTeacher} from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/event/:eventId", getCompetitionsByEvent);
router.get("/:competitionId", getCompetitionById);

// Protected (HOD / Teacher)
router.post("/", protect, specialTeacher, createCompetition);

export default router;
