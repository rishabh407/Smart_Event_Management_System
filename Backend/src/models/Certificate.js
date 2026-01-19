import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({

  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
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

}, { timestamps: true });

// Prevent duplicate certificate
certificateSchema.index(
  { competition: 1, user: 1 },
  { unique: true }
);

// export default mongoose.model("Certificate", certificateSchema);
export default mongoose.models.Certificate ||
mongoose.model("Certificate", certificateSchema);
