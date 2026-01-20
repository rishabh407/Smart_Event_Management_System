import express from "express";
import { createCompetition, getAllCompetitionsByEvent, getCompetitionDetails } from "../controllers/competition.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create competition (Coordinator only → checked inside controller)
router.post("/", protect, createCompetition);

router.get("/event/:eventId",protect,getAllCompetitionsByEvent);

router.get("/:id", protect, getCompetitionDetails);

export default router;

// api/competitions/65687676576578.