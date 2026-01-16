import { v4 as uuidv4 } from "uuid";
import Department from "../models/Department.js";
import User from "../models/User.js";

/**
 * CREATE DEPARTMENT (HOD only)
 */
export const createDepartment = async (req, res) => {
  const { name, shortName, description, email, location } = req.body;

  if (!name || !shortName) {
    return res.status(400).json({ message: "Name and short name are required" });
  }

  // Check if HOD already owns a department
  const existingDept = await Department.findOne({ hodId: req.user.userId });
  if (existingDept) {
    return res
      .status(400)
      .json({ message: "HOD already assigned to a department" });
  }
// Optional safety check
if (req.user.departmentId) {
  return res
    .status(400)
    .json({ message: "HOD already belongs to a department" });
}

  const department = await Department.create({
    departmentId: uuidv4(),
    name,
    shortName,
    description,
    email,
    location,
    hodId: req.user.userId,
  });

  // Update HOD user with departmentId
  await User.updateOne(
    { userId: req.user.userId },
    { departmentId: department.departmentId }
  );

  res.status(201).json({
    message: "Department created successfully",
    department,
  });
};

/**
 * GET ALL DEPARTMENTS (Public)
 */
export const getAllDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

/**
 * GET SINGLE DEPARTMENT
 */
export const getDepartmentById = async (req, res) => {
  const department = await Department.findOne({
    departmentId: req.params.departmentId,
  });

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  res.json(department);
};
