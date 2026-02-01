import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";
import Team from "../models/Team.js";
import QRCode from "qrcode";


export const registerIndividual = async (req, res) => {

 try {

  const { competitionId } = req.body;

  if (!competitionId) {
   return res.status(400).json({
    success: false,
    message: "competitionId is required"
   });
  }

  // Role check
  if (req.user.role !== "STUDENT") {
   return res.status(403).json({
    success: false,
    message: "Only students can register"
   });
  }

  // Fetch competition
  const competition = await Competition.findById(competitionId);

  if (!competition) {
   return res.status(404).json({
    success: false,
    message: "Competition not found"
   });
  }

  // Type check
  if (competition.type !== "individual") {
   return res.status(400).json({
    success: false,
    message: "This competition is not individual type"
   });
  }

  // Deadline check
  if (new Date() > competition.registrationDeadline) {
   return res.status(400).json({
    success: false,
    message: "Registration deadline passed"
   });
  }

  // Duplicate check
  const alreadyRegistered = await Registration.findOne({
   competition: competitionId,
   student: req.user._id,
   status: { $ne: "cancelled" }
  });

  if (alreadyRegistered) {
   return res.status(400).json({
    success: false,
    message: "You already registered"
   });
  }

  // Capacity check
  if (competition.maxParticipants) {

   const count = await Registration.countDocuments({
    competition: competitionId,
    status: "registered"
   });

   if (count >= competition.maxParticipants) {

    competition.registrationOpen = false;
    await competition.save();

    return res.status(400).json({
     success: false,
     message: "Registration full"
    });

   }

  }

  // Registration toggle check
  if (!competition.registrationOpen) {
   return res.status(403).json({
    success: false,
    message: "Registrations are closed for this competition"
   });
  }

  // Generate QR
  const qrPayload = JSON.stringify({
   competitionId,
   studentId: req.user._id,
   type: "individual"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  // Save registration
  const registration = await Registration.create({
   competition: competitionId,
   student: req.user._id,
   registeredBy: req.user._id,
   qrCode: qrImage
  });

  res.status(201).json({
   success: true,
   message: "Registered successfully",
   data: registration
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   success: false,
   message: "Server error"
  });

 }

};

export const registerTeam = async (req, res) => {

 try {

  const { competitionId, teamId } = req.body;

  if (!competitionId || !teamId) {
   return res.status(400).json({
    message: "competitionId and teamId required"
   });
  }

  // Role check
  if (req.user.role !== "STUDENT") {
   return res.status(403).json({
    message: "Only students can register teams"
   });
  }

  // Fetch team
  const team = await Team.findById(teamId);

  if (!team) {
   return res.status(404).json({
    message: "Team not found"
   });
  }

  // Only leader allowed
  if (team.leader.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    message: "Only team leader can register"
   });
  }

  // Prevent double submit
  if (team.isSubmitted) {
   return res.status(400).json({
    message: "Team already submitted"
   });
  }

  // Fetch competition
  const competition = await Competition.findById(competitionId);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  // Registration toggle check
  if (!competition.registrationOpen) {
   return res.status(403).json({
    message: "Registrations are closed for this competition"
   });
  }

  // Result declared block
  if (competition.resultsDeclared === true) {
   return res.status(400).json({
    message: "Results already declared"
   });
  }

  // Type check
  if (competition.type !== "team") {
   return res.status(400).json({
    message: "This competition is not team type"
   });
  }

  // Deadline check
  if (new Date() > competition.registrationDeadline) {
   return res.status(400).json({
    message: "Registration deadline passed"
   });
  }

  // Team belongs check
  if (team.competitionId.toString() !== competitionId) {
   return res.status(400).json({
    message: "Team does not belong to this competition"
   });
  }

  // Team size validation
  if (
   team.members.length < competition.minTeamSize ||
   team.members.length > competition.maxTeamSize
  ) {
   return res.status(400).json({
    message: "Team size not allowed"
   });
  }

  // Duplicate team registration check
  const alreadyRegistered = await Registration.findOne({
   competition: competitionId,
   team: teamId,
   status: { $ne: "cancelled" }
  });

  if (alreadyRegistered) {
   return res.status(400).json({
    message: "Team already registered"
   });
  }

  // Capacity check
  if (competition.maxParticipants) {

   const count = await Registration.countDocuments({
    competition: competitionId,
    status: "registered"
   });

   if (count >= competition.maxParticipants) {

    competition.registrationOpen = false;
    await competition.save();

    return res.status(400).json({
     message: "Registration full"
    });

   }

  }

  // Generate QR
  const qrPayload = JSON.stringify({
   competitionId,
   teamId,
   type: "team"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  // Create registration
  const registration = await Registration.create({
   competition: competitionId,
   team: teamId,
   registeredBy: req.user._id,
   qrCode: qrImage
  });

  // Lock team
  team.isSubmitted = true;
  await team.save();

  res.status(201).json({
   message: "Team registered successfully",
   registration
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }

};


export const getStudentDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Access denied" });
    }

    const studentId = req.user._id;

    // Get student's teams
    const teams = await Team.find({
      members: studentId
    }).select("_id");

    const teamIds = teams.map(t => t._id);

    // Total registrations (individual + team where student is member)
    const totalRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: { $ne: "cancelled" } },
        { team: { $in: teamIds }, status: { $ne: "cancelled" } }
      ]
    });

    // Active registrations
    const activeRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "registered" },
        { team: { $in: teamIds }, status: "registered" }
      ]
    });

    // Attended registrations
    const attendedRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "attended" },
        { team: { $in: teamIds }, status: "attended" }
      ]
    });

    // Cancelled registrations
    const cancelledRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "cancelled" },
        { team: { $in: teamIds }, status: "cancelled" }
      ]
    });

    // Certificates count
    const Certificate = (await import("../models/Certificate.js")).default;
    const certificatesCount = await Certificate.countDocuments({
      user: studentId
    });

    res.status(200).json({
      totalRegistrations,
      activeRegistrations,
      attendedRegistrations,
      cancelledRegistrations,
      certificatesCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRegistrations = async (req, res) => {

  try {

    const userId = req.user._id;

    // 1️⃣ Individual registrations
    const individualRegs = await Registration.find({
      student: userId
    })
      .populate("competition", "name venue startTime endTime")
      .sort({ createdAt: -1 });

    // 2️⃣ Find user's teams
    const teams = await Team.find({
      members: userId
    }).select("_id");

    const teamIds = teams.map(t => t._id);

    // 3️⃣ Team registrations
    const teamRegs = await Registration.find({
      team: { $in: teamIds }
    })
      .populate("competition", "name venue startTime endTime")
      .populate("team", "teamName")
      .sort({ createdAt: -1 });

    // 4️⃣ Merge
    const allRegistrations = [
      ...individualRegs,
      ...teamRegs
    ];

    res.status(200).json({
      success: true,
      data: allRegistrations
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

export const cancelRegistration = async (req, res) => {

  try {

    const { id } = req.params;

    const registration = await Registration.findById(id)
      .populate("competition");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }
    // Ownership check
    if (registration.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Status check
    if (registration.status !== "registered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this registration"
      });
    }

    // Deadline check
    if (new Date() > registration.competition.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Cancellation deadline passed"
      });
    }

    // Results declared check
    if (registration.competition.resultsDeclared) {
      return res.status(400).json({
        success: false,
        message: "Results already declared"
      });
    }
    
    // Cancel
    registration.status = "cancelled";
    await registration.save();

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully"
    });
if (registration.team) {
  const team = await Team.findById(registration.team);
  if (team) {
    team.isSubmitted = false;
    await team.save();
  }

}

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

// ================================
// DELETE CANCELLED REGISTRATION
// ================================

export const deleteRegistration = async (req, res) => {

  try {

    const { id } = req.params;

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    // Only owner can delete
    if (registration.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Only cancelled allowed
    if (registration.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled registrations can be deleted"
      });
    }

    await Registration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Registration deleted permanently"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

export const getRegistrationsByCompetition = async (req, res) => {

 try {

  const { competitionId } = req.params;

  // Role check
  if (req.user.role !== "COORDINATOR") {
   return res.status(403).json({
    message: "Only coordinator allowed"
   });
  }

  // Competition check
  const competition = await Competition.findById(competitionId)
   .populate("eventId");

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  // Ownership check
  if (
   competition.eventId.coordinator.toString() !==
   req.user._id.toString()
  ) {
   return res.status(403).json({
    message: "Access denied"
   });
  }

  // Fetch registrations
  const registrations = await Registration.find({
   competition: competitionId
  })
   .populate("student", "fullName email rollNo")
   .populate("team", "teamName leader members")
   .populate("registeredBy", "fullName email")
   .sort({ createdAt: -1 });

  res.status(200).json({
   success: true,
   data: registrations
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   success: false,
   message: "Server error"
  });

 }
};


export const getCompetitionRegistrationStats = async (req, res) => {

 try {

  const { id } = req.params;

  // Check competition exists
  const competition = await Competition.findById(id);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  // Total registrations
  const total = await Registration.countDocuments({
   competition: id
  });

  // Active registrations
  const active = await Registration.countDocuments({
   competition: id,
   status: "registered"
  });

  // Cancelled
  const cancelled = await Registration.countDocuments({
   competition: id,
   status: "cancelled"
  });

  let slotsLeft = null;
  let isFull = false;

  if (competition.maxParticipants) {

   slotsLeft =
    competition.maxParticipants - active;

   if (slotsLeft <= 0) {
    isFull = true;
   }

  }

  res.status(200).json({
   total,
   active,
   cancelled,
   maxParticipants: competition.maxParticipants || null,
   slotsLeft,
   isFull
  });

 } catch (error) {

  console.error("STATS ERROR:", error);

  res.status(500).json({
   message: "Failed to fetch registration stats"
  });

 }

};


export const getCompetitionRegistrations = async (req, res) => {

 try {

  const { id } = req.params;

  const registrations = await Registration.find({
   competition: id,
   status: { $ne: "cancelled" }   // IMPORTANT FIX
  })
   .populate("student", "fullName email rollNumber")
   .populate("team", "teamName members")
   .sort({ createdAt: -1 });

  res.status(200).json({
   success: true,
   data: registrations
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   success: false,
   message: "Failed to fetch registrations"
  });

 }

};


// export const markAttendanceByQR = async (req, res) => {

//  try {

//   const studentId = req.user._id;
//   const { competitionId } = req.body;

//   // Find registration
//   const registration = await Registration.findOne({
//    competition: competitionId,
//    registeredBy: studentId,
//    status: "registered"
//   });

//   if (!registration) {
//    return res.status(400).json({
//     message: "You are not registered or already attended"
//    });
//   }

//   // Mark attendance
//   registration.status = "attended";
//   await registration.save();

//   res.status(200).json({
//    success: true,
//    message: "Attendance marked successfully"
//   });

//  } catch (error) {

//   console.error(error);

//   res.status(500).json({
//    message: "Attendance failed"
//   });

//  }

// };

// export const markAttendanceByQR = async (req, res) => {

//  try {

//   const { competitionId } = req.body;
//   const studentId = req.user._id;

//   // Find valid registration
//   const registration = await Registration.findOne({
//    competition: competitionId,
//    student: studentId,
//    status: "registered"
//   });

//   if (!registration) {
//    return res.status(400).json({
//     message: "No valid registration found"
//    });
//   }

//   // Prevent double attendance
//   if (registration.status === "attended") {
//    return res.status(400).json({
//     message: "Attendance already marked"
//    });
//   }

//   // Mark attendance
//   registration.status = "attended";
//   await registration.save();

//   res.json({
//    success: true,
//    message: "Attendance marked successfully"
//   });

//  } catch (error) {

//   console.error(error);

//   res.status(500).json({
//    message: "Attendance failed"
//   });

//  }

// };


export const markAttendanceByQR = async (req, res) => {

  try {

    const { competitionId } = req.body;
    const studentId = req.user._id;

    // 1️⃣ Check competition exists
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found"
      });
    }

    const now = new Date();

    // 2️⃣ Check competition timing
    if (now < competition.startTime || now > competition.endTime) {
      return res.status(400).json({
        message: "Attendance allowed only during competition time"
      });
    }

    // 3️⃣ Check student registration
    const registration = await Registration.findOne({
      competition: competitionId,
      student: studentId,
      status: "registered"
    });

    if (!registration) {
      return res.status(403).json({
        message: "You are not registered for this competition"
      });
    }

    // 4️⃣ Prevent double attendance
    if (registration.attended === true) {
      return res.status(409).json({
        message: "Attendance already marked"
      });
    }

    // 5️⃣ Mark attendance
    registration.attended = true;
    registration.status = "attended";
    registration.attendedAt = new Date();

    await registration.save();

    // 6️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Attendance marked successfully"
    });

  } catch (error) {

    console.error("ATTENDANCE ERROR:", error);

    res.status(500).json({
      message: "Attendance failed"
    });

  }

};
