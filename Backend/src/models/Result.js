import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    resultId: {
      type: String,
      required: true,
      unique: true
    },

    competitionId: {
      type: String,
      required: true
    },

    // Winner (individual or team)
    participantId: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["student", "team"],
      required: true
    },

    position: {
      type: Number,
      enum: [1, 2, 3],
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate positions
resultSchema.index(
  { competitionId: 1, position: 1 },
  { unique: true }
);

// Prevent duplicate winner entries
resultSchema.index(
  { competitionId: 1, participantId: 1 },
  { unique: true }
);

export default mongoose.model("Result", resultSchema);
