import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
// import { scanAttendance } from "../controllers/attendance.controller.js";
import { markAttendance } from "../controllers/attendance.controller.js";
// import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// router.post("/scan", protect, scanAttendance);

// router.post(
//  "/attendance",
//  protect,
//  teacherOnly,
//  markAttendance
// );

// Student marks attendance (QR + Manual)
router.post("/mark", protect, markAttendance);
export default router;
