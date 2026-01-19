import Result from "../models/Result.js";
import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";

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
