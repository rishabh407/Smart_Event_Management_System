import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  declareResults,
  getCompetitionResults,
  getMyResults,
  getCoordinatorResults,
  getHodResults
} from "../controllers/result.controller.js";
import { studentOnly, coordinatorOnly, hodOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/declare", protect, declareResults);
router.get("/competition/:competitionId", protect, getCompetitionResults);

// Role-specific result endpoints
router.get("/my", protect, studentOnly, getMyResults);
router.get("/coordinator/my", protect, coordinatorOnly, getCoordinatorResults);
router.get("/hod/my", protect, hodOnly, getHodResults);

export default router;
