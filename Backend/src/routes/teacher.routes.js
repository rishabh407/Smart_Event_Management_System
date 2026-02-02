import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly, teacherOnly } from "../middlewares/role.middleware.js";
import { getAllAssignedCompetitions, getassigncompetition, getDepartmentTeachers, getTeacherDashboardStats } from "../controllers/teacher.controller.js";

const router = express.Router();

router.get(
 "/department",
 protect,
 coordinatorOnly,
 getDepartmentTeachers
);

router.get(
  "/teacher/assigned/all",
  protect,
  teacherOnly,
  getAllAssignedCompetitions
);
router.get("/teacher/assigned/:id",protect,teacherOnly,getassigncompetition);


router.get("/teacher/dashboard-stats", protect, teacherOnly, getTeacherDashboardStats);

export default router;
