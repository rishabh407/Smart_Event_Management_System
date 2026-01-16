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
      enum: ["participation", "winner"],
      required: true
    },

    templateImage: {
      type: String, // Cloudinary URL or local path
      required: true
    },

    textConfig: {
      nameX: Number,
      nameY: Number,
      competitionX: Number,
      competitionY: Number,
      positionX: Number,
      positionY: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("CertificateTemplate", certificateTemplateSchema);
