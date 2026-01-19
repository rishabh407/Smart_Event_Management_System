import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// HOD only
router.post("/", protect, hodOnly, createDepartment);

// Public
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

export default router;
