// routes/user.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";

import { createStudent, createTeacher, getDepartmentStudents, getDepartmentTeachers, toggleStudentStatus, toggleTeacherStatus, updateStudent, updateTeacher, uploadStudents } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";


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
router.get("/students",  protect, hodOnly, getDepartmentStudents);

router.post("/students",  protect, hodOnly, createStudent);

router.put("/students/:id",  protect, hodOnly, updateStudent);

router.patch("/students/status/:studentId",  protect, hodOnly, toggleStudentStatus);

router.post(
  "/students/upload",
  protect,hodOnly,
  upload.single("file"),
  uploadStudents
);
export default router;