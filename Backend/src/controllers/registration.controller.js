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

    // ✅ Role check
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Only students can register"
      });
    }

    // ✅ Competition check
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found"
      });
    }

    // ✅ Type check
    if (competition.type !== "individual") {
      return res.status(400).json({
        success: false,
        message: "This competition is not individual type"
      });
    }

    // ✅ Deadline check
    if (new Date() > competition.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline passed"
      });
    }

    // ✅ Already registered check
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

    // ✅ Max participant limit check
    if (competition.maxParticipants) {

      const count = await Registration.countDocuments({
        competition: competitionId,
        status: "registered"
      });

      if (count >= competition.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: "Registration full"
        });
      }
    }

    // ✅ Generate QR Code
    const qrPayload = JSON.stringify({
      competitionId,
      studentId: req.user._id,
      type: "individual"
    });

    const qrImage = await QRCode.toDataURL(qrPayload);

    // ✅ Save registration
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


// ================================
// TEAM REGISTRATION (TEAM LEADER)
// ================================

export const registerTeam = async (req, res) => {
  try {
    const { competitionId, teamId } = req.body;

    if (!competitionId || !teamId) {
      return res.status(400).json({
        message: "competitionId and teamId required",
      });
    }

    // Only student allowed
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can register teams",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const alreadyRegistered = await Registration.findOne({
  competition: competitionId,
  team: teamId,
  status: { $ne: "cancelled" }
});

    // Prevent double submit
    if (team.isSubmitted) {
      return res.status(400).json({
        message: "Team already submitted",
      });
    }
    
    // Only leader can submit team
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only team leader can register",
      });
    }

    // 🚫 Cancel attempt limit check
const cancelCount = await Registration.countDocuments({
  competition: competitionId,
  team: teamId,
  status: "cancelled"
});

if (cancelCount >= 2) {
  return res.status(403).json({
    message: "Registration limit exceeded. You cannot register again for this competition."
  });
}

    const competition = await Competition.findById(competitionId);

    // Prevent redeclaration
if (competition.resultsDeclared === true) {
  return res.status(400).json({
    message: "Results already declared for this competition"
  });
}
 
    if (!competition) {
      return res.status(404).json({
        message: "Competition not found",
      });
    }

    if (competition.type !== "team") {
      return res.status(400).json({
        message: "This competition is not team type",
      });
    }

    if (new Date() > competition.registrationDeadline) {
      return res.status(400).json({
        message: "Registration deadline passed",
      });
    }

    // Team belongs to competition check
    if (team.competitionId.toString() !== competitionId) {
      return res.status(400).json({
        message: "Team does not belong to this competition",
      });
    }

    // Team size validation
    if (
      team.members.length < competition.minTeamSize ||
      team.members.length > competition.maxTeamSize
    ) {
      return res.status(400).json({
        message: "Team size not allowed",
      });
    }

    // Generate QR Code
    const qrPayload = JSON.stringify({
      competitionId,
      teamId,
      type: "team",
    });

    const qrImage = await QRCode.toDataURL(qrPayload);

    // Create registration
    const registration = await Registration.create({
      competition: competitionId,
      team: teamId,
      registeredBy: req.user._id,
      qrCode: qrImage,
    });

    // 🔐 LOCK TEAM AFTER SUBMISSION
    team.isSubmitted = true;
    await team.save();
// competition.resultsDeclared = true;
// await competition.save();



    res.status(201).json({
      message: "Team registered successfully",
      registration,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
