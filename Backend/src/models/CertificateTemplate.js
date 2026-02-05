import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema({

  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
    unique: true
  },

  participationTemplate: {
    type: String,
    required: true
  },

  winnerTemplate: {
    type: String,
    required: true
  },

  participationPositions: {
    type: Object,
    required: true
  },

  winnerPositions: {
    type: Object,
    required: true
  },

}, { timestamps: true });

export default mongoose.model(
  "CertificateTemplate",
  certificateTemplateSchema
);
