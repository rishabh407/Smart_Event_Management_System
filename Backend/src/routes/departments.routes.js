import express from "express";
import {
  createDepartment,
  createHOD,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";

const router = express.Router();

// HOD only
router.post("/",createDepartment);

// Public
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

router.post("/:departmentId/create-hod", createHOD);

export default router;
