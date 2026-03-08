// routes/user.routes.js

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";

import { getDepartmentTeachers, toggleTeacherStatus } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/hod/teachers", protect, hodOnly, getDepartmentTeachers);

router.patch(
  "/hod/teachers/:teacherId/status",
  protect,
  hodOnly,
  toggleTeacherStatus
);
export default router;