import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";
import Attendance from "../models/Attendance.js";

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

// import Attendance from "../models/Attendance.js";
// import Competition from "../models/Competition.js";

// export const markAttendance = async (req, res) => {

//   try {

//     const { competitionId, method } = req.body;

//     // Student must be logged in
//     const studentId = req.user._id;

//     // Validate competition
//     const competition = await Competition.findById(competitionId);

//     if (!competition) {
//       return res.status(404).json({
//         message: "Competition not found"
//       });
//     }

//     // Check if attendance already marked
//     const existing = await Attendance.findOne({
//       competition: competitionId,
//       student: studentId
//     });

//     if (existing) {
//       return res.status(400).json({
//         message: "Attendance already marked"
//       });
//     }

//     // Find teacher incharge
//     const teacher = competition.assignedTeachers[0]?.teacher;

//     // Save attendance
//     const attendance = await Attendance.create({

//       competition: competitionId,
//       student: studentId,
//       teacher: teacher,
//       method: method || "QR"

//     });

//     res.status(201).json({
//       message: "Attendance marked successfully",
//       attendance
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server error"
//     });

//   }
// };


export const markAttendance = async (req, res) => {
  try {

    // ✅ SAFETY: check login first
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // ✅ ONLY STUDENT CAN MARK QR ATTENDANCE
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can mark attendance"
      });
    }

    const { competitionId, method } = req.body;

    // ✅ REQUIRED FIELD CHECK
    if (!competitionId) {
      return res.status(400).json({
        message: "competitionId required"
      });
    }

    const studentId = req.user._id;

    // ✅ Validate competition
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found"
      });
    }

    // ✅ Duplicate prevention
    const existing = await Attendance.findOne({
      competition: competitionId,
      student: studentId
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked"
      });
    }

    // ✅ Get assigned teacher
    const teacher = competition.assignedTeachers?.[0]?.teacher;

    // ✅ Save attendance
    const attendance = await Attendance.create({
      competition: competitionId,
      student: studentId,
      teacher,
      method: method || "QR"
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
