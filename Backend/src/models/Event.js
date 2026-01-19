// import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     shortDescription: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     bannerImage: {
//       type: String,
//       default: "",
//     },

//     startDate: {
//       type: Date,
//       required: true,
//     },

//     endDate: {
//       type: Date,
//       required: true,
//     },

//     venueOverview: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["upcoming", "ongoing", "completed"],
//       default: "upcoming",
//     },

//     departmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Department",
//       required: true,
//     },

//     coordinator: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Event", eventSchema);

// import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     shortDescription: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     bannerImage: {
//       type: String,
//       default: "",
//     },

//     startDate: {
//       type: Date,
//       required: true,
//     },

//     endDate: {
//       type: Date,
//       required: true,
//     },

//     venueOverview: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["upcoming", "ongoing", "completed"],
//       default: "upcoming",
//     },

//     // ================== CONTROL FLAGS ==================

//     isPublished: {
//       type: Boolean,
//       default: false,
//     },

//     registrationOpen: {
//       type: Boolean,
//       default: true,
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },

//     // ================== RELATIONS ==================

//     departmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Department",
//       default:null
//     },

//     coordinator: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // ================== INDEXES ==================

// eventSchema.index({ startDate: 1 });
// eventSchema.index({ departmentId: 1 });
// eventSchema.index({ coordinator: 1 });

// export default mongoose.model("Event", eventSchema);

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

    // ================= CONTROL FLAGS =================

    isPublished: {
      type: Boolean,
      default: true,
    },

    registrationOpen: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ================= RELATIONS =================

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

// ================= INDEXES =================

eventSchema.index({ startDate: 1 });
eventSchema.index({ departmentId: 1 });
eventSchema.index({ coordinator: 1 });
eventSchema.index({ isPublished: 1, isDeleted: 1 });

export default mongoose.model("Event", eventSchema);
