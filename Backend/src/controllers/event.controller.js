// import Event from "../models/Event.js";
// import User from "../models/User.js";

// // ============================
// // CREATE EVENT (HOD ONLY)
// // ============================

// export const createEvent = async (req, res) => {
//   try {
//     const {
//       title,
//       shortDescription,
//       description,
//       startDate,
//       endDate,
//       venueOverview,
//       bannerImage,
//       coordinatorId
//     } = req.body;

//     if (
//       !title ||
//       !shortDescription ||
//       !description ||
//       !startDate ||
//       !endDate ||
//       !venueOverview ||
//       !coordinatorId
//     ) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // Only HOD allowed
//     if (req.user.role !== "HOD") {
//       return res.status(403).json({ message: "Only HOD can create events" });
//     }

//     // Check coordinator
//     const coordinator = await User.findById(coordinatorId);

//     if (!coordinator || coordinator.role !== "COORDINATOR") {
//       return res.status(400).json({ message: "Invalid coordinator" });
//     }

//     // Department match check
//     if (
//       coordinator.departmentId.toString() !==
//       req.user.departmentId.toString()
//     ) {
//       return res.status(403).json({
//         message: "Coordinator must belong to same department"
//       });
//     }

//     const event = await Event.create({
//       title,
//       shortDescription,
//       description,
//       bannerImage,
//       startDate,
//       endDate,
//       venueOverview,
//       departmentId: req.user.departmentId,
//       coordinator: coordinatorId,
//       createdBy: req.user._id
//     });

//     res.status(201).json({
//       message: "Event created successfully",
//       event
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Event from "../models/Event.js";
import User from "../models/User.js";

// ============================
// CREATE EVENT (HOD ONLY)
// ============================

export const createEvent = async (req, res) => {
  try {

    const {
      title,
      shortDescription,
      description,
      startDate,
      endDate,
      venueOverview,
      coordinatorId
    } = req.body;

    // --------------------------
    // 1️⃣ BASIC VALIDATION
    // --------------------------

    if (
      !title ||
      !shortDescription ||
      !description ||
      !startDate ||
      !endDate ||
      !venueOverview ||
      !coordinatorId
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // --------------------------
    // 2️⃣ ROLE SECURITY CHECK
    // --------------------------

    if (req.user.role !== "HOD") {
      return res.status(403).json({
        message: "Only HOD can create events"
      });
    }

      const bannerImage = req.file
      ? `/uploads/events/${req.file.filename}`
      : "";

    // --------------------------
    // 3️⃣ VERIFY COORDINATOR
    // --------------------------

    const coordinator = await User.findById(coordinatorId);

    if (!coordinator || coordinator.role !== "COORDINATOR") {
      return res.status(400).json({
        message: "Invalid coordinator"
      });
    }
    // --------------------------
    // 4️⃣ DEPARTMENT SECURITY CHECK
    // --------------------------

    if (
      coordinator.departmentId.toString() !==
      req.user.departmentId.toString()
    ) {
      return res.status(403).json({
        message: "Coordinator must belong to same department"
      });
    }

    // --------------------------
    // 5️⃣ CREATE EVENT
    // --------------------------

    const event = await Event.create({
      title,
      shortDescription,
      description,
      bannerImage,
      startDate,
      endDate,
      venueOverview,

      departmentId: req.user.departmentId,
      coordinator: coordinatorId,
      createdBy: req.user._id,

      // Production defaults
      isPublished: false,
      registrationOpen: true,
      isDeleted: false
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const getAllEvents = async (req, res) => {

  const events = await Event.find({
    isPublished: true,
    isDeleted: false
  })
    .populate("coordinator", "fullName")
    .sort({ startDate: 1 });
   console.log(events);
  res.json(events);
};

// ============================
// GET EVENTS FOR STUDENT DASHBOARD
// ============================

// export const getStudentEvents = async (req, res) => {
//   try {

//     // Only students allowed
//     if (req.user.role !== "STUDENT") {
//       return res.status(403).json({
//         message: "Students only"
//       });
//     }

//     const events = await Event.find({
//       departmentId: req.user.departmentId
//     }).sort({ startDate: 1 });
//     console.log(events);
//     res.json(events);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getStudentEvents = async (req, res) => {
  try {

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Students only"
      });
    }

    if (!req.user.departmentId) {
      return res.status(400).json({
        message: "Student not assigned to any department"
      });
    }

    const events = await Event.find({
      departmentId: req.user.departmentId
    }).sort({ startDate: 1 });

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
