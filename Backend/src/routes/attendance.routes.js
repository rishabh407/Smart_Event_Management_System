import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { scanAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/scan", protect, scanAttendance);

export default router;
