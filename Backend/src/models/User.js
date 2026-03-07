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
      sparse: true, //Allows multiple documents with null email
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // when user find data of user then password not get beacause we are using select:false.
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "HOD", "COORDINATOR"],// enum means only allows these values which are present here.
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
