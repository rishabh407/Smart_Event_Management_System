import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs with null email
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false // hide password by default
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "HOD", "COORDINATOR"],
      required: true
    },

    // =====================
    // STUDENT FIELDS
    // =====================

    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    course: {
      type: String,
      trim: true
    },

    year: {
      type: Number
    },

    section: {
      type: String,
      trim: true
    },

    // =====================
    // LOGIN CONTROL
    // =====================

    isFirstLogin: {
      type: Boolean,
      default: false
    },

    // =====================
    // COMMON FIELDS
    // =====================

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);