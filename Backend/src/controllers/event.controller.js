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

    // ---------- BASIC VALIDATION ----------

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

    // ---------- ROLE CHECK ----------

    if (req.user.role !== "HOD") {
      return res.status(403).json({
        message: "Only HOD can create events"
      });
    }

    // ---------- DATE VALIDATION ----------

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    // ---------- IMAGE ----------

    const bannerImage = req.file
      ? `/uploads/events/${req.file.filename}`
      : "";

    // ---------- COORDINATOR VALIDATION ----------

    const coordinator = await User.findById(coordinatorId);

    if (!coordinator || coordinator.role !== "COORDINATOR") {
      return res.status(400).json({
        message: "Invalid coordinator"
      });
    }

    // ---------- DEPARTMENT SECURITY ----------

    if (
      coordinator.departmentId.toString() !==
      req.user.departmentId.toString()
    ) {
      return res.status(403).json({
        message: "Coordinator must belong to same department"
      });
    }

    // ---------- CREATE EVENT ----------

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

      isPublished: true,
      registrationOpen: true,
      isDeleted: false
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ============================
// GET ALL PUBLISHED EVENTS
// ============================

export const getAllEvents = async (req, res) => {

  try {

    const events = await Event.find({
      isPublished: true,
      isDeleted: false
    })
      .select("-__v")
      .populate("coordinator", "fullName")
      .sort({ startDate: 1 });

    res.status(200).json(events);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ============================
// STUDENT EVENTS (DEPARTMENT)
// ============================

export const getStudentEvents = async (req, res) => {

  try {

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Students only"
      });
    }

    if (!req.user.departmentId) {
      return res.status(400).json({
        message: "Student not assigned to department"
      });
    }

    const events = await Event.find({
      departmentId: req.user.departmentId,
      isPublished: true,
      isDeleted: false
    })
      .sort({ startDate: 1 });

    res.status(200).json(events);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
