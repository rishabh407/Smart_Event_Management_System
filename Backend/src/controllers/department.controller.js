import Department from "../models/Department.js";
import User from "../models/User.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, shortName, description, location } = req.body;

    if (!name || !shortName) {
      return res.status(400).json({
        message: "Name and short name are required"
      });
    }
    const existingDepartment = await Department.findOne({
      $or: [
        { name: name.trim() },
        { shortName: shortName.trim().toUpperCase() }
      ]
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }
    const department = await Department.create({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      description,
      location,
      hod: null
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
export const getAllDepartments = async (req, res) => {
  const departments = await Department.find().populate("hod", "fullName email");
  res.json(departments);
};
 
export const getDepartmentById = async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate("hod", "fullName email");

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  res.json(department);
};

export const createHOD = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId, fullName, email, password } = req.body;
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    if (department.hod) {
      return res.status(400).json({ message: "HOD already assigned" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash(password, 10);
    const hod = await User.create({
      userId,
      fullName,
      email,
      password: hashedPassword,
      role: "HOD",
      departmentId
    });
    department.hod = hod._id;
    await department.save();

    res.status(201).json({
      message: "HOD created successfully",
      hod
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};