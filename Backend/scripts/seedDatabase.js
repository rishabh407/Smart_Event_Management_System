import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Department from "../src/models/Department.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/event-management";

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");
    console.log("📁 Creating Department...");
    let department = await Department.findOne({ shortName: "CS" });
    
    if (!department) {
      department = await Department.create({
        name: "Computer Science",
        shortName: "CS",
        description: "Computer Science Department",
        location: "Building A, Floor 2"
      });
      console.log("✅ Department created:", department.name);
    } else {
      console.log("ℹ️  Department already exists:", department.name);
    }

    console.log("\n👔 Creating HOD User...");
    let hod = await User.findOne({ email: "hod@college.edu" });
    
    if (!hod) {
      const hodPassword = await bcrypt.hash("hod123", 10);
      hod = await User.create({
        userId: uuidv4(),
        fullName: "Dr. John Smith",
        email: "hod@college.edu",
        password: hodPassword,
        role: "HOD",
        departmentId: department._id,
        isActive: true,
        isFirstLogin: false
      });
      console.log("✅ HOD created:", hod.fullName);
      console.log("   Email: hod@college.edu");
      console.log("   Password: hod123");
    } else {
      console.log("ℹ️  HOD already exists:", hod.fullName);
    }
    department.hod = hod._id;
    await department.save();

    
    console.log("\n👨‍💼 Creating Coordinator User...");
    let coordinator = await User.findOne({ email: "coordinator@college.edu" });
    
    if (!coordinator) {
      const coordPassword = await bcrypt.hash("coordinator123", 10);
      coordinator = await User.create({
        userId: uuidv4(),
        fullName: "Ms. Jane Doe",
        email: "coordinator@college.edu",
        password: coordPassword,
        role: "COORDINATOR",
        departmentId: department._id,
        isActive: true,
        isFirstLogin: false
      });
      console.log("✅ Coordinator created:", coordinator.fullName);
      console.log("   Email: coordinator@college.edu");
      console.log("   Password: coordinator123");
    } else {
      console.log("ℹ️  Coordinator already exists:", coordinator.fullName);
    }

    
    console.log("\n👨‍🏫 Creating Teacher User...");
    let teacher = await User.findOne({ email: "teacher@college.edu" });
    
    if (!teacher) {
      const teacherPassword = await bcrypt.hash("teacher123", 10);
      teacher = await User.create({
        userId: uuidv4(),
        fullName: "Prof. Robert Johnson",
        email: "teacher@college.edu",
        password: teacherPassword,
        role: "TEACHER",
        departmentId: department._id,
        isActive: true,
        isFirstLogin: false
      });
      console.log("✅ Teacher created:", teacher.fullName);
      console.log("   Email: teacher@college.edu");
      console.log("   Password: teacher123");
    } else {
      console.log("ℹ️  Teacher already exists:", teacher.fullName);
    }

    
    console.log("\n👨‍🎓 Creating Student User...");
    let student = await User.findOne({ rollNumber: "STU001" });
    
    if (!student) {
      const studentPassword = await bcrypt.hash("STU001", 10);
      student = await User.create({
        userId: uuidv4(),
        fullName: "Alice Williams",
        rollNumber: "STU001",
        password: studentPassword,
        role: "STUDENT",
        departmentId: department._id,
        course: "B.Tech",
        year: 3,
        section: "A",
        isActive: true,
        isFirstLogin: true
      });
      console.log("✅ Student created:", student.fullName);
      console.log("   Roll Number: STU001");
      console.log("   Password: STU001 (must change on first login)");
    } else {
      console.log("ℹ️  Student already exists:", student.fullName);
    } 

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Database seeding completed!");
    console.log("=".repeat(50));
    console.log("\n📋 Login Credentials:");
    console.log("   HOD:        hod@college.edu / hod123");
    console.log("   Coordinator: coordinator@college.edu / coordinator123");
    console.log("   Teacher:    teacher@college.edu / teacher123");
    console.log("   Student:   STU001 / STU001\n"); 

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

