import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true
    },

    competitionId: {
      type: String,
      required: true
    },

    userId: {
      type: String,
      default: null
    },

    teamId: {
      type: String,
      default: null
    },

    type: {
      type: String,
      enum: ["participation", "winner"],
      required: true
    },

    position: {
      type: Number,
      default: null
    },

    pdfUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate certificate per participant
certificateSchema.index(
  { competitionId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } }
);

certificateSchema.index(
  { competitionId: 1, teamId: 1 },
  { unique: true, partialFilterExpression: { teamId: { $exists: true, $ne: null } } }
);

export default mongoose.model("Certificate", certificateSchema);
