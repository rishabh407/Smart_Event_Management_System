import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    competitionId: {
      type: String,
      required: true,
      unique: true,
    },

    eventId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    rules: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["individual", "team"],
      required: true,
    },

    minTeamSize: {
      type: Number,
      default: null,
    },

    maxTeamSize: {
      type: Number,
      default: null,
    },

    maxParticipants: {
      type: Number,
      default: null,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    assignedTeachers: [
      {
        teacherId: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["incharge", "coordinator", "judge"],
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Competition", competitionSchema);
