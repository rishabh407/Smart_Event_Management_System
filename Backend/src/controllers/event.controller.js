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
      bannerImage,
      coordinatorId
    } = req.body;

    if (
      !title ||
      !shortDescription ||
      !description ||
      !startDate ||
      !endDate ||
      !venueOverview ||
      !coordinatorId
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Only HOD allowed
    if (req.user.role !== "HOD") {
      return res.status(403).json({ message: "Only HOD can create events" });
    }

    // Check coordinator
    const coordinator = await User.findById(coordinatorId);

    if (!coordinator || coordinator.role !== "COORDINATOR") {
      return res.status(400).json({ message: "Invalid coordinator" });
    }

    // Department match check
    if (
      coordinator.departmentId.toString() !==
      req.user.departmentId.toString()
    ) {
      return res.status(403).json({
        message: "Coordinator must belong to same department"
      });
    }

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
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
