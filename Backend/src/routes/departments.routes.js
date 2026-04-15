import express from "express";
import {
  createDepartment,
  createHOD,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/department.controller.js";

const router = express.Router();


router.post("/",createDepartment);


router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

router.post("/:departmentId/create-hod", createHOD);

export default router;
