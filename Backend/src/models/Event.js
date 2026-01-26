import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    venueOverview: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    // ---------- CONTROL FLAGS ----------

// ---------- CONTROL FLAGS ----------
isPublished: {
  type: Boolean,
  default: false,
},

publishedAt: {
  type: Date,
  default: null,
},

isDeleted: {
  type: Boolean,
  default: false,
},
    // ---------- RELATIONS ----------

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ---------- INDEXING ----------

eventSchema.index({ startDate: 1 });
eventSchema.index({ departmentId: 1 });
eventSchema.index({ coordinator: 1 });
eventSchema.index({ isPublished: 1, isDeleted: 1 });

// ---------- LIVE STATUS VIRTUAL ----------

eventSchema.virtual("liveStatus").get(function () {

  const now = new Date();

  if (now < this.startDate) return "upcoming";

  if (now >= this.startDate && now <= this.endDate)
    return "ongoing";

  return "completed";

});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export default mongoose.model("Event", eventSchema);
