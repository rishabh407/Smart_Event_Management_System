import Department from "../models/Department.js";
import User from "../models/User.js";

/**
 * CREATE DEPARTMENT (HOD only)
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, shortName, description, location } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({ message: "Name and short name are required" });
    }

    // Check if HOD already owns a department
    const existingDept = await Department.findOne({ hod: req.user._id });

    if (existingDept) {
      return res
        .status(400)
        .json({ message: "HOD already assigned to a department" });
    }

    // Extra safety check
    if (req.user.departmentId) {
      return res
        .status(400)
        .json({ message: "HOD already belongs to a department" });
    }

    const department = await Department.create({
      name,
      shortName,
      description,
      location,
      hod: req.user._id,
    });

    // Update HOD user with department reference
    await User.updateOne(
      { _id: req.user._id },
      { departmentId: department._id }
    );

    res.status(201).json({
      message: "Department created successfully",
      department,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL DEPARTMENTS (Public)
 */
export const getAllDepartments = async (req, res) => {
  const departments = await Department.find().populate("hod", "fullName email");
  res.json(departments);
};

/**
 * GET SINGLE DEPARTMENT
 */
export const getDepartmentById = async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate("hod", "fullName email");

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  res.json(department);
};
