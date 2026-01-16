import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true
    },

    competitionId: {
      type: String,
      required: true
    },

    // Individual participation
    studentId: {
      type: String,
      default: null
    },

    // Team participation
    teamId: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered"
    }
  },
  { timestamps: true }
);

// Prevent duplicate registration
registrationSchema.index(
  { competitionId: 1, studentId: 1 },
  { unique: true, sparse: true }
);

registrationSchema.index(
  { competitionId: 1, teamId: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model("Registration", registrationSchema);
