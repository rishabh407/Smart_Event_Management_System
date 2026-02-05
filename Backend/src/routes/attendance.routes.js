import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getCompetitionAttendance, markAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

// Student marks attendance (QR + Manual)
router.post("/mark", protect, markAttendance);
router.get(
  "/competition/:competitionId",
  protect,
  getCompetitionAttendance
);

export default router;
