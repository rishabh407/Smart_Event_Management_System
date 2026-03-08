// controllers/user.controller.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
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

/* ================= CREATE TEACHER ================= */

export const createTeacher = async (req, res) => {

  try {

    let { fullName, email, userId, password } = req.body;

    /* ================= VALIDATION ================= */

    if (!fullName || !email || !userId || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    fullName = fullName.trim();
    email = email.trim().toLowerCase();
    userId = userId.trim();

    if (fullName.length < 3) {
      return res.status(400).json({
        message: "Full name must be at least 3 characters"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    /* ================= DUPLICATE CHECK ================= */

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const existingUserId = await User.findOne({ userId });

    if (existingUserId) {
      return res.status(400).json({
        message: "User ID already exists"
      });
    }

    /* ================= PASSWORD HASH ================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= CREATE TEACHER ================= */

    const teacher = await User.create({
      fullName,
      email,
      userId,
      password: hashedPassword,
      role: "TEACHER",

      departmentId: req.user.departmentId,

      isActive: true,
      isFirstLogin: true,

      // avoid student fields
      course: undefined,
      year: undefined,
      section: undefined
    });

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json(teacherResponse);

  } catch (error) {

    console.error("Create teacher error:", error);

    res.status(500).json({
      message: "Failed to create teacher"
    });

  }

};

/* ================= UPDATE TEACHER ================= */

export const updateTeacher = async (req, res) => {

  try {

    const { id } = req.params;
    const { fullName, email } = req.body;

    /* ================= FIND TEACHER ================= */

    const teacher = await User.findById(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    /* ================= ROLE VALIDATION ================= */

    if (teacher.role !== "TEACHER") {
      return res.status(403).json({
        message: "Invalid user role"
      });
    }

    /* ================= DEPARTMENT SECURITY ================= */

    if (teacher.departmentId.toString() !== req.user.departmentId.toString()) {
      return res.status(403).json({
        message: "You can only edit teachers from your department"
      });
    }

    /* ================= EMAIL DUPLICATE CHECK ================= */

    if (email && email !== teacher.email) {

      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      teacher.email = email;

    }

    /* ================= UPDATE NAME ================= */

    if (fullName) {
      teacher.fullName = fullName;
    }

    await teacher.save();

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(200).json(teacherResponse);

  } catch (error) {

    console.error("Update teacher error:", error);

    res.status(500).json({
      message: "Failed to update teacher"
    });

  }

};