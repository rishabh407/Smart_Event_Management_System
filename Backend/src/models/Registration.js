import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
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

    
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    qrCode: {
      type: String,
      default: null,
    },

    
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },

    
    attended: {
      type: Boolean,
      default: false,
    },

    
    attendedAt: {
      type: Date,
      default: null,
    },

    certificateGenerated: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);






registrationSchema.index(
  { competition: 1, student: 1 },
  {
    unique: true,
    partialFilterExpression: {
      student: { $exists: true, $ne: null },
    },
  }
);


registrationSchema.index(
  { competition: 1, team: 1 },
  {
    unique: true,
    partialFilterExpression: {
      team: { $exists: true, $ne: null },
    },
  }
);
registrationSchema.index({ competition: 1, attended: 1 });

export default mongoose.model("Registration", registrationSchema);
