// routes/user.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";

import { createTeacher, getDepartmentTeachers, toggleTeacherStatus, updateTeacher } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/hod/teachers", protect, hodOnly, getDepartmentTeachers);

router.post("/hod/teachers", protect, hodOnly, createTeacher);

router.put("/hod/teachers/:id", protect, hodOnly, updateTeacher);

router.patch(
  "/hod/teachers/:teacherId/status",
  protect,
  hodOnly,
  toggleTeacherStatus
);


export default router;