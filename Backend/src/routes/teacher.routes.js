import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly, teacherOnly } from "../middlewares/role.middleware.js";
import { getassigncompetition, getDepartmentTeachers } from "../controllers/teacher.controller.js";

const router = express.Router();

router.get(
 "/department",
 protect,
 coordinatorOnly,
 getDepartmentTeachers
);

router.get("/teacher/assigned",protect,teacherOnly,getassigncompetition);
export default router;
