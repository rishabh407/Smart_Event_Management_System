import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly } from "../middlewares/role.middleware.js";
import { getDepartmentTeachers } from "../controllers/teacher.controller.js";

const router = express.Router();

router.get(
 "/department",
 protect,
 coordinatorOnly,
 getDepartmentTeachers
);

export default router;
