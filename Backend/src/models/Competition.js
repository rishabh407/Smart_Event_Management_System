import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
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
registrationOpen: {
 type: Boolean,
 default: true
},

    registrationDeadline: {
      type: Date,
      required: true,
    },
isPublished: {
 type: Boolean,
 default: false
}
,
isDeleted: {
 type: Boolean,
 default: false
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

    // Teachers assigned to this competition
    assignedTeachers: [
      {
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["INCHARGE", "JUDGE"],
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
 
    // 🔐 RESULT LOCK
    resultsDeclared: {
      type: Boolean,
      default: false,
    },
     
  },
  { timestamps: true }
);

export default mongoose.model("Competition", competitionSchema);
