import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true
    },

    teamName: {
      type: String,
      required: true,
      trim: true
    },

    competitionId: {
      type: String,
      required: true
    },

    leaderId: {
      type: String, // userId
      required: true
    },

    members: [
      {
        type: String // userId
      }
    ],

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export default mongoose.model("Team", teamSchema);
