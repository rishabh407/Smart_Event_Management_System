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
      sparse: true, 
      lowercase: true,
      trim: true
    },
// email: {
//   type: String,
//   unique: true,
//   sparse: true,
//   lowercase: true,
//   trim: true,
//   default: undefined // ✅ KEY FIX
// }
// ,
    password: {
      type: String,
      required: true,
      select: false 
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "HOD", "COORDINATOR"],
      required: true
    },

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

    isFirstLogin: {
      type: Boolean,
      default: false
    },

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