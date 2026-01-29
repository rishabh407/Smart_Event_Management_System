import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  method: {
    type: String,
    enum: ["QR", "MANUAL"],
    default: "QR"
  },

  markedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });


// 🔥 Prevent duplicate attendance (Database Level Safety)
attendanceSchema.index(
  { competition: 1, student: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
