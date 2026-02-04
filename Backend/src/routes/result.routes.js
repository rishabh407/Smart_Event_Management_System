import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { declareResults, getCompetitionResults } from "../controllers/result.controller.js";

const router = express.Router();

router.post("/declare", protect, declareResults);
router.get("/competition/:competitionId", protect, getCompetitionResults);

export default router;
