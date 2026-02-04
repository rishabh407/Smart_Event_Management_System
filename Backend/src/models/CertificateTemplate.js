// import mongoose from "mongoose";

// const certificateTemplateSchema = new mongoose.Schema({

// competition: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Competition",
//   required: true
// },

//   type: {
//     type: String,
//     enum: ["participation", "winner", "participant_hackathon", "winner_hackathon"],
//     required: true,
//   },

//   templatePath: {
//     type: String,
//     required: true,
//   },

//   textConfig: {
//     nameX: Number,
//     nameY: Number,
//     teamX: Number,
//     teamY: Number,
//     positionX: Number,
//     positionY: Number
//   }

// }, { timestamps: true });

// // ✅ Prevent duplicate template per competition + type
// certificateTemplateSchema.index(
//   { competition: 1, type: 1 },
//   { unique: true }
// );

// export default mongoose.model("CertificateTemplate", certificateTemplateSchema);

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
