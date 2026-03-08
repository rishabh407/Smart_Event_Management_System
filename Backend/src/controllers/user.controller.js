// controllers/user.controller.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import XLSX from "xlsx";

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

export const getDepartmentStudents = async (req, res) => {
  try {

    const hodDepartment = req.user.departmentId;

    const students = await User.find({
      role: "STUDENT",
      departmentId: hodDepartment
    })
      .select("fullName email userId rollNumber course year section isActive createdAt")
      .lean();

    res.status(200).json(students);

  } catch (error) {

    console.error("Fetch students error:", error);

    res.status(500).json({
      message: "Failed to fetch students"
    });

  }
};

export const createStudent = async (req, res) => {

  try {

    let {
      fullName,
      email,
      userId,
      password,
      rollNumber,
      course,
      year,
      section
    } = req.body;

    if (!fullName || !userId || !password || !rollNumber) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const existingUserId = await User.findOne({ userId });

    if (existingUserId) {
      return res.status(400).json({
        message: "User ID already exists"
      });
    }

    const existingRoll = await User.findOne({ rollNumber });

    if (existingRoll) {
      return res.status(400).json({
        message: "Roll number already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({

      fullName,
      email,
      userId,
      password: hashedPassword,

      role: "STUDENT",

      rollNumber,
      course,
      year,
      section,

      departmentId: req.user.departmentId,

      isFirstLogin: true,
      isActive: true
    });

    const response = student.toObject();
    delete response.password;

    res.status(201).json(response);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create student"
    });

  }

};

export const updateStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const { fullName, email, rollNumber, course, year, section } = req.body;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "STUDENT") {
      return res.status(403).json({ message: "Invalid role" });
    }

    if (student.departmentId.toString() !== req.user.departmentId.toString()) {
      return res.status(403).json({
        message: "You can only edit students from your department"
      });
    }

    // Duplicate roll check
    if (rollNumber && rollNumber !== student.rollNumber) {

      const existingRoll = await User.findOne({ rollNumber });

      if (existingRoll) {
        return res.status(400).json({
          message: "Roll number already exists"
        });
      }

      student.rollNumber = rollNumber;
    }

    if (fullName) student.fullName = fullName;
    if (email) student.email = email;
    if (course) student.course = course;
    if (year) student.year = year;
    if (section) student.section = section;

    await student.save();

    const response = student.toObject();
    delete response.password;

    res.json(response);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update student"
    });

  }

};

export const toggleStudentStatus = async (req, res) => {

  try {

    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    student.isActive = !student.isActive;

    await student.save();

    res.json({
      message: "Student status updated",
      isActive: student.isActive
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update status"
    });

  }

};

export const uploadStudents = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Excel file required" });
    }

    /* READ EXCEL FILE */

    const workbook = XLSX.readFile(req.file.path);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const departmentId = req.user.departmentId;

    const inserted = [];
    const errors = [];

    /* FETCH EXISTING DATA ONCE (FASTER) */

    const existingUsers = await User.find(
      {},
      { userId: 1, rollNumber: 1 }
    ).lean();

    const existingUserIds = new Set(existingUsers.map(u => u.userId));
    const existingRollNumbers = new Set(existingUsers.map(u => u.rollNumber));

    const excelUserIds = new Set();
    const excelRollNumbers = new Set();

    /* PROCESS EACH ROW */

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];

      const fullName = String(row.fullName || "").trim();
      const email = String(row.email || "").trim().toLowerCase();
      const userId = String(row.userId || "").trim();
      const rollNumber = String(row.rollNumber || "").trim();
      const course = String(row.course || "").trim();
      const year = Number(row.year);
      const section = String(row.section || "").trim();

      /* REQUIRED FIELD VALIDATION */

      if (!fullName || !userId || !rollNumber) {
        errors.push({
          row: i + 2,
          message: "Missing required fields"
        });
        continue;
      }

      /* DUPLICATE CHECK INSIDE EXCEL */

      if (excelUserIds.has(userId)) {
        errors.push({
          row: i + 2,
          message: "Duplicate User ID in Excel file"
        });
        continue;
      }

      if (excelRollNumbers.has(rollNumber)) {
        errors.push({
          row: i + 2,
          message: "Duplicate Roll Number in Excel file"
        });
        continue;
      }

      /* DUPLICATE CHECK IN DATABASE */

      if (existingUserIds.has(userId)) {
        errors.push({
          row: i + 2,
          message: "User ID already exists"
        });
        continue;
      }

      if (existingRollNumbers.has(rollNumber)) {
        errors.push({
          row: i + 2,
          message: "Roll number already exists"
        });
        continue;
      }

      /* HASH PASSWORD */

      const hashedPassword = await bcrypt.hash("123456", 10);

      /* CREATE STUDENT */

      const student = {
        fullName,
        email,
        userId,
        rollNumber,
        course,
        year,
        section,
        password: hashedPassword,
        role: "STUDENT",
        departmentId,
        isActive: true,
        isFirstLogin: true
      };

      inserted.push(student);

      excelUserIds.add(userId);
      excelRollNumbers.add(rollNumber);

    }

    /* BULK INSERT */

    if (inserted.length) {
      await User.insertMany(inserted);
    }

    /* RESPONSE */

    res.json({
      insertedCount: inserted.length,
      errorCount: errors.length,
      errors
    });

  } catch (error) {

    console.error("Upload students error:", error);

    res.status(500).json({
      message: "Upload failed"
    });

  }
};

export const createCoordinator = async (req, res) => {

  try {

    const { fullName, email, userId, password } = req.body;

    const departmentId = req.user.departmentId;

    const existingCoordinator = await User.findOne({
      role: "COORDINATOR",
      departmentId
    });

    if (existingCoordinator) {
      return res.status(400).json({
        message: "Coordinator already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const coordinator = await User.create({

      fullName,
      email,
      userId,
      password: hashedPassword,

      role: "COORDINATOR",

      departmentId,

      isActive: true,
      isFirstLogin: true

    });

    const response = coordinator.toObject();
    delete response.password;

    res.status(201).json(response);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create coordinator"
    });

  }

};

export const getDepartmentCoordinator = async (req, res) => {

  try {

    const coordinator = await User.findOne({
      role: "COORDINATOR",
      departmentId: req.user.departmentId
    }).select("fullName email userId role");

    res.json(coordinator);

  } catch {

    res.status(500).json({
      message: "Failed to fetch coordinator"
    });

  }

};

export const updateCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const coordinator = await User.findById(id);

    if (!coordinator) {
      return res.status(404).json({
        message: "Coordinator not found"
      });
    }

    if (coordinator.role !== "COORDINATOR") {
      return res.status(400).json({
        message: "User is not coordinator"
      });
    }

    if (fullName) coordinator.fullName = fullName;
    if (email) coordinator.email = email;

    await coordinator.save();

    const response = coordinator.toObject();
    delete response.password;

    res.json(response);

  } catch {

    res.status(500).json({
      message: "Failed to update coordinator"
    });

  }

};