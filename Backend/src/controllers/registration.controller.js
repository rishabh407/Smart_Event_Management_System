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

  
  if (req.user.role !== "STUDENT") {
   return res.status(403).json({
    success: false,
    message: "Only students can register"
   });
  }

  
  const competition = await Competition.findById(competitionId);

  if (!competition) {
   return res.status(404).json({
    success: false,
    message: "Competition not found"
   });
  }

  
  if (competition.type !== "individual") {
   return res.status(400).json({
    success: false,
    message: "This competition is not individual type"
   });
  }

  
  if (new Date() > competition.registrationDeadline) {
   return res.status(400).json({
    success: false,
    message: "Registration deadline passed"
   });
  }

  
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

  
  if (!competition.registrationOpen) {
   return res.status(403).json({
    success: false,
    message: "Registrations are closed for this competition"
   });
  }

  
  const qrPayload = JSON.stringify({
   competitionId,
   studentId: req.user._id,
   type: "individual"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  
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

  
  if (req.user.role !== "STUDENT") {
   return res.status(403).json({
    message: "Only students can register teams"
   });
  }

  
  const team = await Team.findById(teamId);

  if (!team) {
   return res.status(404).json({
    message: "Team not found"
   });
  }

  
  if (team.leader.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    message: "Only team leader can register"
   });
  }

  
  if (team.isSubmitted) {
   return res.status(400).json({
    message: "Team already submitted"
   });
  }

  
  const competition = await Competition.findById(competitionId);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  
  if (!competition.registrationOpen) {
   return res.status(403).json({
    message: "Registrations are closed for this competition"
   });
  }

  
  if (competition.resultsDeclared === true) {
   return res.status(400).json({
    message: "Results already declared"
   });
  }

  
  if (competition.type !== "team") {
   return res.status(400).json({
    message: "This competition is not team type"
   });
  }

  
  if (new Date() > competition.registrationDeadline) {
   return res.status(400).json({
    message: "Registration deadline passed"
   });
  }

  
  if (team.competitionId.toString() !== competitionId) {
   return res.status(400).json({
    message: "Team does not belong to this competition"
   });
  }

  
  if (
   team.members.length < competition.minTeamSize ||
   team.members.length > competition.maxTeamSize
  ) {
   return res.status(400).json({
    message: "Team size not allowed"
   });
  }

  
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

  
  const qrPayload = JSON.stringify({
   competitionId,
   teamId,
   type: "team"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  
  const registration = await Registration.create({
   competition: competitionId,
   team: teamId,
   registeredBy: req.user._id,
   qrCode: qrImage
  });

  
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

    
    const teams = await Team.find({
      members: studentId
    }).select("_id");

    const teamIds = teams.map(t => t._id);

    
    const totalRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: { $ne: "cancelled" } },
        { team: { $in: teamIds }, status: { $ne: "cancelled" } }
      ]
    });

    
    const activeRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "registered" },
        { team: { $in: teamIds }, status: "registered" }
      ]
    });

    
    const attendedRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "attended" },
        { team: { $in: teamIds }, status: "attended" }
      ]
    });

    
    const cancelledRegistrations = await Registration.countDocuments({
      $or: [
        { student: studentId, status: "cancelled" },
        { team: { $in: teamIds }, status: "cancelled" }
      ]
    });

    
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

    
    const individualRegs = await Registration.find({
      student: userId
    })
      .populate("competition", "name venue startTime endTime")
      .sort({ createdAt: -1 });

    
    const teams = await Team.find({
      members: userId
    }).select("_id");

    const teamIds = teams.map(t => t._id);

    
    const teamRegs = await Registration.find({
      team: { $in: teamIds }
    })
      .populate("competition", "name venue startTime endTime")
      .populate("team", "teamName")
      .sort({ createdAt: -1 });

    
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

    
    if (registration.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    
    if (registration.status !== "registered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this registration"
      });
    }

    
    if (new Date() > registration.competition.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Cancellation deadline passed"
      });
    }

    
    if (registration.competition.resultsDeclared) {
      return res.status(400).json({
        success: false,
        message: "Results already declared"
      });
    }

    
    registration.status = "cancelled";
    await registration.save();

    
    if (registration.team) {

      const team = await Team.findById(registration.team);

      if (team) {
        team.isSubmitted = false;
        await team.save();
      }

    }

    
    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};
























































export const deleteRegistration = async (req, res) => {

  try {

    const { id } = req.params;

    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    
    if (registration.registeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    
    if (registration.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled registrations can be deleted"
      });
    }

    
    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: "Registration deleted permanently"
    });

  } catch (error) {

    console.error("Delete registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

export const getRegistrationsByCompetition = async (req, res) => {

 try {

  const { competitionId } = req.params;

  
  if (req.user.role !== "COORDINATOR") {
   return res.status(403).json({
    message: "Only coordinator allowed"
   });
  }

  
  const competition = await Competition.findById(competitionId)
   .populate("eventId");

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  
  if (
   competition.eventId.coordinator.toString() !==
   req.user._id.toString()
  ) {
   return res.status(403).json({
    message: "Access denied"
   });
  }

  
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

    const competition = await Competition.findById(id)
      .select("maxParticipants");

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    const totalRegistered = await Registration.countDocuments({
      competition: id,
      status: { $in: ["registered", "attended"] }
    });

    const present = await Registration.countDocuments({
      competition: id,
      status: "attended"
    });

    const cancelled = await Registration.countDocuments({
      competition: id,
      status: "cancelled"
    });

    const slotsLeft = competition.maxParticipants
      ? competition.maxParticipants - totalRegistered
      : null;

    res.status(200).json({
      totalRegistered,
      present,
      cancelled,
      maxParticipants: competition.maxParticipants || null,
      slotsLeft,
      isFull: slotsLeft !== null && slotsLeft <= 0
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
   status: { $ne: "cancelled" }   
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


export const markAttendanceByQR = async (req, res) => {

  try {

    const { competitionId } = req.body;
    const studentId = req.user._id;

    
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found"
      });
    }

    const now = new Date();

    
    if (now < competition.startTime || now > competition.endTime) {
      return res.status(400).json({
        message: "Attendance allowed only during competition time"
      });
    }

    let registration;

    
    if (competition.type === "individual") {
      
      registration = await Registration.findOne({
        competition: competitionId,
        student: studentId,
        status: "registered"
      });
    } else if (competition.type === "team") {
      
      
      const team = await Team.findOne({
        competitionId,
        $or: [
          { leader: studentId },
          { members: studentId }
        ]
      });

      if (team) {
        registration = await Registration.findOne({
          competition: competitionId,
          team: team._id,
          status: "registered"
        });
      }
    }

    
    if (!registration) {
      return res.status(403).json({
        message: "You are not registered for this competition"
      });
    }

    
    if (registration.attended === true) {
      return res.status(409).json({
        message: "Attendance already marked"
      });
    }

    
    registration.attended = true;
    registration.status = "attended";
    registration.attendedAt = new Date();

    await registration.save();

    
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


export const getAttendanceStats = async (req, res) => {

  try {

    const { id } = req.params;

    const registrations = await Registration.find({
      competition: id,
      status: { $ne: "cancelled" }
    });

    const total = registrations.length;
    const attended = registrations.filter(r => r.status === "attended").length;
    const pending = total - attended;

    res.json({
      success: true,
      total,
      attended,
      pending
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load attendance stats"
    });

  }
};
