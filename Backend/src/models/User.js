import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "HOD", "COORDINATOR"],
      required: true,
    },

    // =====================
    // STUDENT FIELDS
    // =====================

    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    isFirstLogin: {
      type: Boolean,
      default: false,
    },

    course: {
      type: String,
      default: null,
    },

    year: {
      type: Number,
      default: null,
    },

    section: {
      type: String,
      default: null,
    },

    // =====================
    // COMMON
    // =====================

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
