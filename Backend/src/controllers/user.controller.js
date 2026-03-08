// controllers/user.controller.js

import User from "../models/User.js";

export const getDepartmentTeachers = async (req, res) => {

  try {

    const hodDepartment = req.user.departmentId;

    const teachers = await User.find({
      role: "TEACHER",
      departmentId: hodDepartment
    })
      .select("fullName email userId isActive createdAt")
      .lean();

    res.status(200).json(teachers);

  } catch (error) {

    console.error("Fetch teachers error:", error);

    res.status(500).json({
      message: "Failed to fetch teachers"
    });

  }

};

export const toggleTeacherStatus = async (req, res) => {

  try {

    const { teacherId } = req.params;

    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.isActive = !teacher.isActive;

    await teacher.save();

    res.json({
      message: "Teacher status updated",
      isActive: teacher.isActive
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update status"
    });

  }

};