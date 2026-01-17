import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true
    },

    competitionId: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["participation", "winner","participant_hackathon", 
    "winner_hackathon"],
      required: true
    },

    templatePath: {
      type: String, // Cloudinary URL or local path
      required: true
    },

textConfig: {
  nameX: Number,
  nameY: Number,

  teamX: Number,
  teamY: Number,

  competitionX: Number,
  competitionY: Number,

  positionX: Number,
  positionY: Number
}

  },
  { timestamps: true }
);

export default mongoose.model("CertificateTemplate", certificateTemplateSchema);
