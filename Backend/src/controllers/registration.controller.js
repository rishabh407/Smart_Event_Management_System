
import { v4 as uuidv4 } from "uuid";
import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";
import Team from "../models/Team.js";
import QRCode from "qrcode";

/**
 * REGISTER TEAM TO COMPETITION
 */
// export const registerTeam = async (req, res) => {
//   const { competitionId, teamId } = req.body;

//   if (!competitionId || !teamId) {
//     return res
//       .status(400)
//       .json({ message: "competitionId and teamId required" });
//   }

//   // Competition check
//   const competition = await Competition.findOne({ competitionId });

//   if (!competition) {
//     return res.status(404).json({ message: "Competition not found" });
//   }

//   // Must be team competition
//   if (competition.type !== "team") {
//     return res.status(400).json({
//       message: "This competition does not allow team registration"
//     });
//   }

//   // Deadline check
//   if (new Date() > competition.registrationDeadline) {
//     return res.status(400).json({
//       message: "Registration deadline passed"
//     });
//   }

//   // Team check
//   const team = await Team.findOne({ teamId });

//   if (!team) {
//     return res.status(404).json({ message: "Team not found" });
//   }

//   // Leader authorization
//   if (team.leaderId !== req.user.userId) {
//     return res.status(403).json({
//       message: "Only team leader can register the team"
//     });
//   }

//   // Team belongs to competition check
//   if (team.competitionId !== competitionId) {
//     return res.status(400).json({
//       message: "Team does not belong to this competition"
//     });
//   }

//   // Min team size validation
//   if (competition.minTeamSize) {
//     if (team.members.length < competition.minTeamSize) {
//       return res.status(400).json({
//         message: `Minimum ${competition.minTeamSize} members required`
//       });
//     }
//   }

//   // Prevent duplicate registration
//   const alreadyRegistered = await Registration.findOne({
//     competitionId,
//     teamId
//   });

//   if (alreadyRegistered) {
//     return res.status(400).json({
//       message: "Team already registered"
//     });
//   }

//   // Register team
//   const registration = await Registration.create({
//     registrationId: uuidv4(),
//     competitionId,
//     teamId
//   });

//   res.status(201).json({
//     message: "Team registered successfully",
//     registration
//   });
// };


// /**
//  * REGISTER INDIVIDUAL TO COMPETITION
//  */
// export const registerIndividual = async (req, res) => {
//   const { competitionId } = req.body;

//   if (!competitionId) {
//     return res.status(400).json({
//       message: "competitionId required"
//     });
//   }

//   // Competition check
//   const competition = await Competition.findOne({ competitionId });

//   if (!competition) {
//     return res.status(404).json({
//       message: "Competition not found"
//     });
//   }

//   // Must be individual competition
//   if (competition.type !== "individual") {
//     return res.status(400).json({
//       message: "This competition requires team registration"
//     });
//   }

//   // Deadline check
//   if (new Date() > competition.registrationDeadline) {
//     return res.status(400).json({
//       message: "Registration deadline passed"
//     });
//   }

//   // Prevent duplicate registration
//   const alreadyRegistered = await Registration.findOne({
//     competitionId,
//     studentId: req.user.userId
//   });

//   if (alreadyRegistered) {
//     return res.status(400).json({
//       message: "Already registered for this competition"
//     });
//   }

//   // Register individual
//   const registration = await Registration.create({
//     registrationId: uuidv4(),
//     competitionId,
//     studentId: req.user.userId
//   });

//   res.status(201).json({
//     message: "Successfully registered",
//     registration
//   });
// };

// Individual
export const registerIndividual = async (req, res) => {
  const { competitionId } = req.body;

  if (!competitionId) {
    return res.status(400).json({
      message: "competitionId required"
    });
  }

  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({
      message: "Competition not found"
    });
  }

  if (competition.type !== "individual") {
    return res.status(400).json({
      message: "This competition requires team registration"
    });
  }

  if (new Date() > competition.registrationDeadline) {
    return res.status(400).json({
      message: "Registration deadline passed"
    });
  }

  const alreadyRegistered = await Registration.findOne({
    competitionId,
    studentId: req.user.userId
  });

  if (alreadyRegistered) {
    return res.status(400).json({
      message: "Already registered for this competition"
    });
  }

  const registrationId = uuidv4();

  const qrPayload = JSON.stringify({
    registrationId,
    competitionId,
    type: "individual"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  const registration = await Registration.create({
    registrationId,
    competitionId,
    studentId: req.user.userId,
    qrCode: qrImage
  });

  res.status(201).json({
    message: "Successfully registered",
    registration
  });
};

// Team 

export const registerTeam = async (req, res) => {
  const { competitionId, teamId } = req.body;

  if (!competitionId || !teamId) {
    return res.status(400).json({
      message: "competitionId and teamId required"
    });
  }

  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({ message: "Competition not found" });
  }

  if (competition.type !== "team") {
    return res.status(400).json({
      message: "This competition does not allow team registration"
    });
  }

  if (new Date() > competition.registrationDeadline) {
    return res.status(400).json({
      message: "Registration deadline passed"
    });
  }

  const team = await Team.findOne({ teamId });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (team.leaderId !== req.user.userId) {
    return res.status(403).json({
      message: "Only team leader can register"
    });
  }

  if (team.competitionId !== competitionId) {
    return res.status(400).json({
      message: "Team does not belong to this competition"
    });
  }

  if (competition.minTeamSize && team.members.length < competition.minTeamSize) {
    return res.status(400).json({
      message: `Minimum ${competition.minTeamSize} members required`
    });
  }

  const alreadyRegistered = await Registration.findOne({
    competitionId,
    teamId
  });

  if (alreadyRegistered) {
    return res.status(400).json({
      message: "Team already registered"
    });
  }

  const registrationId = uuidv4();

  const qrPayload = JSON.stringify({
    registrationId,
    competitionId,
    type: "team"
  });

  const qrImage = await QRCode.toDataURL(qrPayload);

  const registration = await Registration.create({
    registrationId,
    competitionId,
    teamId,
    qrCode: qrImage
  });

  res.status(201).json({
    message: "Team registered successfully",
    registration
  });
};
