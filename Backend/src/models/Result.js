import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    position: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    declaredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


resultSchema.index(
  { competition: 1, position: 1 },
  { unique: true }
);


resultSchema.index(
  { competition: 1, student: 1 },
  {
    unique: true,
    partialFilterExpression: {
      student: { $ne: null },
    },
  }
);


resultSchema.index(
  { competition: 1, team: 1 },
  {
    unique: true,
    partialFilterExpression: {
      team: { $ne: null },
    },
  }
);

export default mongoose.model("Result", resultSchema);
