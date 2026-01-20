// import Competition from "../models/Competition.js";
// import Event from "../models/Event.js";
// import User from "../models/User.js";

// // ============================
// // CREATE COMPETITION (COORDINATOR ONLY)
// // ============================

// export const createCompetition = async (req, res) => {
//   try {
//     const {
//       eventId,
//       name,
//       shortDescription,
//       rules,
//       type,
//       minTeamSize,
//       maxTeamSize,
//       maxParticipants,
//       registrationDeadline,
//       venue,
//       startTime,
//       endTime,
//       assignedTeachers,
//     } = req.body;

//     // Basic validation
//     if (
//       !eventId ||
//       !name ||
//       !shortDescription ||
//       !type ||
//       !registrationDeadline ||
//       !venue ||
//       !startTime ||
//       !endTime
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Only coordinator can create competition
//     if (req.user.role !== "COORDINATOR") {
//       return res.status(403).json({
//         message: "Only coordinator can create competitions",
//       });
//     }

//     // Check event exists
//     const event = await Event.findById(eventId);

//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Check coordinator is assigned to this event
//     if (event.coordinator.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not assigned to this event",
//       });
//     }

//     // Team validation
//     if (type === "team" && (!minTeamSize || !maxTeamSize)) {
//       return res.status(400).json({
//         message: "Team size required for team competition",
//       });
//     }

//     // ============================
//     // TEACHER ASSIGNMENT VALIDATION
//     // ============================

//     if (assignedTeachers && assignedTeachers.length > 0) {
//       for (let item of assignedTeachers) {
//         const teacher = await User.findById(item.teacher);

//         if (!teacher) {
//           return res.status(400).json({
//             message: "Assigned teacher not found",
//           });
//         }

//         // Must be TEACHER role
//         if (teacher.role !== "TEACHER") {
//           return res.status(400).json({
//             message: "Only teachers can be assigned",
//           });
//         }

//         // Must belong to same department
//         if (
//           teacher.departmentId.toString() !==
//           req.user.departmentId.toString()
//         ) {
//           return res.status(403).json({
//             message: "Teacher must belong to same department",
//           });
//         }
//       }
//     }

//     // ============================
//     // CREATE COMPETITION
//     // ============================

//     const competition = await Competition.create({
//       eventId,
//       name,
//       shortDescription,
//       rules,
//       type,
//       minTeamSize,
//       maxTeamSize,
//       maxParticipants,
//       registrationDeadline,
//       venue,
//       startTime,
//       endTime,
//       assignedTeachers,
//       resultsDeclared: false
//     });

//     res.status(201).json({
//       message: "Competition created successfully",
//       competition,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Competition from "../models/Competition.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

// ============================
// CREATE COMPETITION (COORDINATOR ONLY)
// ============================

export const createCompetition = async (req, res) => {
  try {

    const {
      eventId,
      name,
      shortDescription,
      rules,
      type,
      minTeamSize,
      maxTeamSize,
      maxParticipants,
      registrationDeadline,
      venue,
      startTime,
      endTime,
      assignedTeachers,
    } = req.body;

    // ---------------- VALIDATION ----------------

    if (!eventId || !name || !shortDescription || !type || !registrationDeadline || !venue || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.user.role !== "COORDINATOR") {
      return res.status(403).json({ message: "Only coordinator can create competitions" });
    }

    // ---------------- EVENT CHECK ----------------

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.coordinator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not assigned to this event" });
    }

    // ---------------- TEAM VALIDATION ----------------

    if (type === "team") {
      if (!minTeamSize || !maxTeamSize) {
        return res.status(400).json({ message: "Team size required" });
      }

      if (minTeamSize > maxTeamSize) {
        return res.status(400).json({ message: "Invalid team size range" });
      }
    }

    // ---------------- TEACHER VALIDATION ----------------

    if (assignedTeachers?.length > 0) {

      for (let t of assignedTeachers) {

        const teacher = await User.findById(t.teacher);

        if (!teacher || teacher.role !== "TEACHER") {
          return res.status(400).json({ message: "Invalid assigned teacher" });
        }

        if (teacher.departmentId.toString() !== req.user.departmentId.toString()) {
          return res.status(403).json({ message: "Teacher must belong to same department" });
        }
      }
    }

    // ---------------- CREATE ----------------

    const competition = await Competition.create({
      eventId,
      name,
      shortDescription,
      rules,
      type,
      minTeamSize,
      maxTeamSize,
      maxParticipants,
      registrationDeadline,
      venue,
      startTime,
      endTime,
      assignedTeachers,
      resultsDeclared: false
    });

    res.status(201).json({
      message: "Competition created successfully",
      competition
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCompetitionsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("Event Id Is",eventId);
    const competitions = await Competition.find({
      eventId: eventId
    })
      .populate("assignedTeachers.teacher", "fullName")
      .sort({ startTime: 1 });

    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompetitionDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const competition = await Competition.findById(id)
      .populate("assignedTeachers.teacher", "fullName");

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found"
      });
    }

    res.status(200).json({
      success: true,
      data: competition
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};
