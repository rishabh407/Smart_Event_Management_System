import Result from "../models/Result.js";
import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export const declareResults = async (req, res) => {
  try {
    console.log(req.body);
    const { competitionId, winners } = req.body;

    if (!competitionId || !winners || winners.length === 0) {
      return res.status(400).json({
        message: "Invalid result data",
      });
    }

    // Only TEACHER allowed
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({
        message: "Only teachers can declare results",
      });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    // Check INCHARGE teacher
    const isIncharge = competition.assignedTeachers.some(
      (t) =>
        t.teacher.toString() === req.user._id.toString() &&
        t.role === "INCHARGE"
    );

    if (!isIncharge) {
      return res.status(403).json({
        message: "Not authorized to declare results",
      });
    }

    const savedResults = [];

    for (const winner of winners) {
      const { participantId, position } = winner;

      if (!participantId || !position) {
        return res.status(400).json({
          message: "participantId and position required",
        });
      }

      // Attendance validation
      let attendance;

      if (competition.type === "individual") {
        attendance = await Registration.findOne({
          competition: competitionId,
          student: participantId,
          status: "attended",
        });
      } else {
        attendance = await Registration.findOne({
          competition: competitionId,
          team: participantId,
          status: "attended",
        });
      }

      if (!attendance) {
        return res.status(400).json({
          message: "Winner must be present in attendance",
        });
      }

      const resultData = {
        competition: competitionId,
        position,
        declaredBy: req.user._id,
      };

      if (competition.type === "individual") {
        resultData.student = participantId;
      } else {
        resultData.team = participantId;
      }

      const result = await Result.create(resultData);
      savedResults.push(result);
    }
    // ========================
    // 🔐 LOCK COMPETITION
    // ========================

    competition.resultsDeclared = true;
    await competition.save();
    
    res.status(201).json({
      message: "Results declared successfully",
      results: savedResults,
    });

  } catch (error) {
    console.error("Result declaration error:", error);

    // Duplicate position or duplicate winner error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Result already declared for this position or participant"
      });
    }

    res.status(500).json({
      message: "Server error while declaring result"
    });
  }
};

export const getCompetitionResults = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const user = req.user;

    if (!competitionId) {
      return res.status(400).json({
        message: "competitionId is required",
      });
    }

    const competition = await Competition.findById(competitionId)
      .populate("eventId", "title coordinator");

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    // ================= ROLE-BASED ACCESS CONTROL =================
    
    // STUDENT: Can only see results if they registered/attended
    if (user.role === "STUDENT") {
      const registration = await Registration.findOne({
        competition: competitionId,
        $or: [
          { student: user._id },
          { registeredBy: user._id }
        ],
        status: { $in: ["registered", "attended"] }
      });

      if (!registration) {
        return res.status(403).json({
          message: "You are not registered for this competition",
        });
      }
    }

    // TEACHER: Can only see results for assigned competitions
    if (user.role === "TEACHER") {
      const isAssigned = competition.assignedTeachers.some(
        t => t.teacher.toString() === user._id.toString()
      );

      if (!isAssigned) {
        return res.status(403).json({
          message: "You are not assigned to this competition",
        });
      }
    }

    // COORDINATOR: Can only see results for competitions in their events
    if (user.role === "COORDINATOR") {
      if (competition.eventId.coordinator.toString() !== user._id.toString()) {
        return res.status(403).json({
          message: "This competition does not belong to your events",
        });
      }
    }

    // HOD: Can only see results for competitions in their department's events
    if (user.role === "HOD") {
      if (competition.eventId.departmentId.toString() !== user.departmentId.toString()) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    const results = await Result.find({ competition: competitionId })
      .populate("student", "fullName rollNumber email")
      .populate("team", "teamName members")
      .sort({ position: 1 });

    return res.json({
      competition: {
        _id: competition._id,
        name: competition.name,
        type: competition.type,
        venue: competition.venue,
        startTime: competition.startTime,
        endTime: competition.endTime,
        resultsDeclared: competition.resultsDeclared,
      },
      results,
    });
  } catch (error) {
    console.error("GET COMPETITION RESULTS ERROR:", error);
    return res.status(500).json({
      message: "Failed to load competition results",
    });
  }
};

// GET /api/results/my (Student: Get all competitions they participated in with results)
export const getMyResults = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Students only" });
    }

    // Find all registrations where student attended
    const registrations = await Registration.find({
      $or: [
        { student: req.user._id },
        { registeredBy: req.user._id }
      ],
      status: "attended"
    }).populate("competition", "name type venue startTime endTime resultsDeclared eventId");

    // Filter competitions that have results declared
    const competitionsWithResults = registrations
      .map(r => r.competition)
      .filter(c => c && c.resultsDeclared && !c.isDeleted);

    // Get results for each competition
    const resultsData = await Promise.all(
      competitionsWithResults.map(async (comp) => {
        const results = await Result.find({ competition: comp._id })
          .populate("student", "fullName rollNumber email")
          .populate("team", "teamName members")
          .sort({ position: 1 });

        // Check if student won
        const myResult = results.find(r => {
          if (comp.type === "individual") {
            return r.student?._id.toString() === req.user._id.toString();
          } else {
            // For team, check if user is in the team
            return r.team?.members?.some(
              m => m.toString() === req.user._id.toString()
            );
          }
        });

        return {
          competition: {
            _id: comp._id,
            name: comp.name,
            type: comp.type,
            venue: comp.venue,
            startTime: comp.startTime,
            endTime: comp.endTime,
          },
          results,
          myPosition: myResult?.position || null,
        };
      })
    );

    res.json({
      success: true,
      data: resultsData,
    });
  } catch (error) {
    console.error("GET MY RESULTS ERROR:", error);
    res.status(500).json({
      message: "Failed to load results",
    });
  }
};

// GET /api/results/coordinator/my (Coordinator: Get results for all competitions in their events)
export const getCoordinatorResults = async (req, res) => {
  try {
    if (req.user.role !== "COORDINATOR") {
      return res.status(403).json({ message: "Coordinators only" });
    }

    // Get coordinator's events
    const myEvents = await Event.find({
      coordinator: req.user._id,
      isDeleted: false
    });

    const eventIds = myEvents.map(e => e._id);

    // Get competitions under these events that have results
    const competitions = await Competition.find({
      eventId: { $in: eventIds },
      isDeleted: false,
      resultsDeclared: true
    }).populate("eventId", "title");

    // Get results for each competition
    const resultsData = await Promise.all(
      competitions.map(async (comp) => {
        const results = await Result.find({ competition: comp._id })
          .populate("student", "fullName rollNumber email")
          .populate("team", "teamName members")
          .sort({ position: 1 });

        return {
          competition: {
            _id: comp._id,
            name: comp.name,
            type: comp.type,
            venue: comp.venue,
            startTime: comp.startTime,
            endTime: comp.endTime,
            event: comp.eventId,
          },
          results,
        };
      })
    );

    res.json({
      success: true,
      data: resultsData,
    });
  } catch (error) {
    console.error("GET COORDINATOR RESULTS ERROR:", error);
    res.status(500).json({
      message: "Failed to load results",
    });
  }
};

// GET /api/results/hod/my (HOD: Get results for all competitions in their department's events)
export const getHodResults = async (req, res) => {
  try {
    if (req.user.role !== "HOD") {
      return res.status(403).json({ message: "HOD only" });
    }

    // Get HOD's events
    const myEvents = await Event.find({
      createdBy: req.user._id,
      isDeleted: false
    });

    const eventIds = myEvents.map(e => e._id);

    // Get competitions under these events that have results
    const competitions = await Competition.find({
      eventId: { $in: eventIds },
      isDeleted: false,
      resultsDeclared: true
    }).populate("eventId", "title coordinator");

    // Get results for each competition
    const resultsData = await Promise.all(
      competitions.map(async (comp) => {
        const results = await Result.find({ competition: comp._id })
          .populate("student", "fullName rollNumber email")
          .populate("team", "teamName members")
          .sort({ position: 1 });

        return {
          competition: {
            _id: comp._id,
            name: comp.name,
            type: comp.type,
            venue: comp.venue,
            startTime: comp.startTime,
            endTime: comp.endTime,
            event: comp.eventId,
          },
          results,
        };
      })
    );

    res.json({
      success: true,
      data: resultsData,
    });
  } catch (error) {
    console.error("GET HOD RESULTS ERROR:", error);
    res.status(500).json({
      message: "Failed to load results",
    });
  }
};