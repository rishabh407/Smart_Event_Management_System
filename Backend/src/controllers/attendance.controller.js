import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";

export const scanAttendance = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        message: "QR data required",
      });
    }

    // Only teacher allowed
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({
        message: "Only teachers can mark attendance",
      });
    }

    // Parse QR payload
    let payload;

    try {
      payload = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid QR code format",
      });
    }

    const { competitionId, studentId, teamId, type } = payload;

    if (!competitionId || !type) {
      return res.status(400).json({
        message: "Invalid QR content",
      });
    }

    // Find registration
    let registration;

    if (type === "individual") {
      registration = await Registration.findOne({
        competition: competitionId,
        student: studentId,
      });
    } else if (type === "team") {
      registration = await Registration.findOne({
        competition: competitionId,
        team: teamId,
      });
    } else {
      return res.status(400).json({
        message: "Invalid participation type",
      });
    }

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    // Prevent double attendance
    if (registration.status === "attended") {
      return res.status(400).json({
        message: "Attendance already marked",
      });
    }

    // Verify teacher is INCHARGE of this competition
    const competition = await Competition.findById(competitionId);

    const isIncharge = competition.assignedTeachers.some(
      (t) =>
        t.teacher.toString() === req.user._id.toString() &&
        t.role === "INCHARGE"
    );

    if (!isIncharge) {
      return res.status(403).json({
        message: "You are not authorized to mark attendance",
      });
    }

    // Mark attendance
    registration.status = "attended";
    await registration.save();

    res.json({
      message: "Attendance marked successfully",
      registration,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
