import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },

    competitionId: {
      type: String,
      required: true,
    },

    // Individual participation
    studentId: {
      type: String,
      default: null,
    },

    // Team participation
    teamId: {
      type: String,
      default: null,
    },

    // Attendance Qr Code
    qrCode: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },
    certificateGenerated: {
       type: Boolean,
       default: false,
    },
  },
  { timestamps: true }
);

// Team registration uniqueness
registrationSchema.index(
  { competitionId: 1, teamId: 1 },
  // we group records like '
  //   (C1, T1)
  // (C1, T2)
  // (C2, T1)
  {
    unique: true,
    // this ensures no duplicate records exists like 
  //   (C1, T1)
  //   (C1, T1)
    partialFilterExpression: {
      teamId: { $exists: true, $ne: null },
    },
    // partialFilterExpression =  This is magic part 
    // It says : 
   
    // ONLY apply this index
    // when condition is TRUE
// Condition = teamId: { $exists: true, $ne: null }
// Means:

// Apply index ONLY if:

// ✔ teamId field exists
// ✔ teamId is NOT null
  }
);

// Individual registration uniqueness
registrationSchema.index(
  { competitionId: 1, studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentId: { $exists: true, $ne: null },
    },
  }
);

export default mongoose.model("Registration", registrationSchema);
