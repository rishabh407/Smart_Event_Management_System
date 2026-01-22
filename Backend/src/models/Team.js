import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    isSubmitted: {
      type: Boolean,
      default: false, // becomes true after registration submit
    },

  },

  { timestamps: true }
);

teamSchema.index(
 { competitionId: 1, teamName: 1 },
 { unique: true }
);

export default mongoose.model("Team", teamSchema);
