import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { scanAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/scan", protect, teacherOnly, scanAttendance);

export default router;
