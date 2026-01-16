import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    hodId: {
      type: String, // userId of HOD
      default: null,
    },

    email: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
