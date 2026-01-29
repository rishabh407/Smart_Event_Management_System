import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { scanAttendance } from "../controllers/attendance.controller.js";
import { markAttendance } from "../controllers/registration.controller.js";
import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/scan", protect, scanAttendance);

router.post(
 "/attendance",
 protect,
 teacherOnly,
 markAttendance
);

export default router;
