import Competition from "../models/Competition.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
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
 resultsDeclared: false,
 isPublished: false,
 isDeleted: false
});

    res.status(201).json({
      message: "Competition created successfully",
      competition
    });

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

/* =====================================================
   GET COMPETITIONS OF AN EVENT (COORDINATOR)
   ===================================================== */

export const getCompetitionsByEvent = async (req, res) => {

 try {

  const { eventId } = req.params;

  // Check event exists
  const event = await Event.findById(eventId);

  if (!event) {
   return res.status(404).json({
    message: "Event not found"
   });
  }

  // Only assigned coordinator can access
  if (event.coordinator.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    message: "Access denied"
   });
  }

  // Fetch competitions of event
  const competitions = await Competition.find({
   eventId,
   isDeleted: false
  }).sort({ createdAt: -1 });

  res.status(200).json(competitions);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

export const getPublicCompetitionsByEvent = async (req, res) => {

 try {

  const { eventId } = req.params;

  const competitions = await Competition.find({
   eventId,
   isDeleted: false,
   isPublished: true
  }).sort({ startTime: 1 });

  res.status(200).json(competitions);

 } catch (error) {

  res.status(500).json({ message: "Server error" });

 }
};


/* =====================================================
   PUBLISH COMPETITION
   ===================================================== */
export const publishCompetition = async (req, res) => {

 try {

  const { id } = req.params;

  const updatedCompetition =
    await Competition.findByIdAndUpdate(
      id,
      {
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    );

  if (!updatedCompetition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  console.log("PUBLISHED VALUE:", updatedCompetition.isPublished);

  res.status(200).json({
   message: "Competition published successfully",
   competition: updatedCompetition
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};





/* =====================================================
   UNPUBLISH COMPETITION
   ===================================================== */

export const unpublishCompetition = async (req, res) => {

 try {

  const { id } = req.params;

  const updatedCompetition =
    await Competition.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true }
    );

  if (!updatedCompetition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  console.log("UNPUBLISHED VALUE:", updatedCompetition.isPublished);

  res.status(200).json({
   message: "Competition unpublished successfully",
   competition: updatedCompetition
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};



export const getCompetitionById = async (req, res) => {

  try {

    const competition = await Competition.findById(req.params.id)
      .populate("assignedTeachers.teacher", "fullName email");

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.status(200).json(competition);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};


export const updateCompetition = async (req, res) => {

 try {

  const { id } = req.params;

  const competition = await Competition.findById(id);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  // Prevent editing after start
  if (new Date() >= competition.startTime) {
   return res.status(400).json({
    message: "Competition already started"
   });
  }

  const allowedFields = [
   "name",
   "shortDescription",
   "venue",
   "registrationDeadline",
   "startTime",
   "endTime",
   "maxParticipants",
   "minTeamSize",
   "maxTeamSize"
  ];

  allowedFields.forEach(field => {

   if (req.body[field] !== undefined) {
    competition[field] = req.body[field];
   }

  });

  await competition.save();

  res.status(200).json({
   message: "Competition updated successfully",
   competition
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

export const getCoordinatorDashboardStats = async (req, res) => {

 try {

  if (req.user.role !== "COORDINATOR") {
   return res.status(403).json({
    message: "Access denied"
   });
  }

  // Get coordinator events
  const events = await Event.find({
   coordinator: req.user._id
  }).select("_id");

  const eventIds = events.map(e => e._id);

  // Get competitions of those events
  const competitions = await Competition.find({
   eventId: { $in: eventIds },
   isDeleted: false
  });

  const competitionIds = competitions.map(c => c._id);

  // Total registrations
  const totalRegistrations = await Registration.countDocuments({
   competition: { $in: competitionIds }
  });

  // Active registrations
  const activeRegistrations = await Registration.countDocuments({
   competition: { $in: competitionIds },
   status: "registered"
  });

  const publishedCount = competitions.filter(
   c => c.isPublished === true
  ).length;

  res.status(200).json({

   totalCompetitions: competitions.length,
   publishedCompetitions: publishedCount,
   totalRegistrations,
   activeRegistrations

  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

export const toggleRegistrationStatus = async (req, res) => {

 try {

  const { id } = req.params;

  const competition = await Competition.findById(id);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  // Toggle
  competition.registrationOpen = !competition.registrationOpen;

  await competition.save();

  res.status(200).json({
   message: "Registration status updated",
   registrationOpen: competition.registrationOpen
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

export const deleteCompetition = async (req, res) => {

  try {

    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found"
      });
    }

    await Competition.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Competition deleted successfully"
    });

  } catch (error) {

    console.error("Delete Competition Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting competition"
    });

  }
};