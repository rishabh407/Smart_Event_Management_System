// import mongoose from "mongoose";

// const registrationSchema = new mongoose.Schema(
//   {
//     competition: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Competition",
//       required: true,
//     },

//     // For individual competition
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // For team competition
//     team: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//       default: null,
//     },

//     // Who submitted registration (student or team leader)
//     registeredBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // QR code for attendance verification
//     qrCode: {
//       type: String,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["registered", "attended", "cancelled"],
//       default: "registered",
//     },

//     certificateGenerated: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // Prevent duplicate individual registration
// registrationSchema.index(
//   { competition: 1, student: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       student: { $exists: true, $ne: null },
//     },
//   }
// );

// // Prevent duplicate team registration
// registrationSchema.index(
//   { competition: 1, team: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       team: { $exists: true, $ne: null },
//     },
//   }
// );

// export default mongoose.model("Registration", registrationSchema);


import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    // Individual registration
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Team registration
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    // Who submitted registration
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // QR code image (used by student panel display)
    qrCode: {
      type: String,
      default: null,
    },

    // Registration + Attendance Status
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },

    // Attendance Flag (IMPORTANT)
    attended: {
      type: Boolean,
      default: false,
    },

    // Attendance Time (IMPORTANT)
    attendedAt: {
      type: Date,
      default: null,
    },

    certificateGenerated: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);



// ================= PREVENT DUPLICATES =================

// Individual duplicate prevention
registrationSchema.index(
  { competition: 1, student: 1 },
  {
    unique: true,
    partialFilterExpression: {
      student: { $exists: true, $ne: null },
    },
  }
);

// Team duplicate prevention
registrationSchema.index(
  { competition: 1, team: 1 },
  {
    unique: true,
    partialFilterExpression: {
      team: { $exists: true, $ne: null },
    },
  }
);
registrationSchema.index({ competition: 1, attended: 1 });

export default mongoose.model("Registration", registrationSchema);
