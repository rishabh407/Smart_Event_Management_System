// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       select: false,
//     },

//     role: {
//       type: String,
//       enum: ["student", "teacher", "hod"],
//       required: true,
//     },

//     // =====================
//     // STUDENT FIELDS
//     // =====================

//     rollNumber: {
//       type: String,
//       default: null,
//       unique: true,
//       sparse: true
//     },

//     isFirstLogin: {
//     type: Boolean,
//     default: false
//   },

//     course: {
//       type: String,
//       default: null,
//     },

//     year: {
//       type: Number,
//       default: null,
//     },

//     section: {
//       type: String,
//       default: null,
//     },

//     // =====================
//     // COMMON
//     // =====================

//     departmentId: {
//       type: String,
//       default: null,
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }
// );

// export default mongoose.model("User", userSchema);


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
      enum: ["student", "teacher", "hod"],
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
      type: String,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model("User", userSchema);
