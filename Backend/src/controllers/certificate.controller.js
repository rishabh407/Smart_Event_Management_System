// import { v4 as uuidv4 } from "uuid";
// import Certificate from "../models/Certificate.js";
// import CertificateTemplate from "../models/CertificateTemplate.js";
// import Registration from "../models/Registration.js";
// import Result from "../models/Result.js";
// import User from "../models/User.js";
// import { generateCertificatePDF } from "../utils/certificateGenerator.js";
// import Competition from "../models/Competition.js";
// import Team from "../models/Team.js";

// export const generateCertificates = async (req, res) => {
//   const { competitionId } = req.body;

//   if (!competitionId) {
//     return res.status(400).json({
//       message: "competitionId required"
//     });
//   }

//   const participationTemplate = await CertificateTemplate.findOne({
//     competitionId,
//     type: "participation"
//   });

//   const winnerTemplate = await CertificateTemplate.findOne({
//     competitionId,
//     type: "winner"
//   });

//   if (!participationTemplate || !winnerTemplate) {
//     return res.status(400).json({
//       message: "Both templates required"
//     });
//   }

//   const registrations = await Registration.find({
//     competitionId,
//     status: "attended",
//     certificateGenerated: false
//   });

//   if (registrations.length === 0) {
//     return res.json({
//       message: "No new certificates to generate"
//     });
//   }

//   const winners = await Result.find({ competitionId });

//   const competition = await Competition.findOne({ competitionId });

//   if (!competition) {
//     return res.status(404).json({
//       message: "Competition not found"
//     });
//   }

//   const generatedCertificates = [];

//   for (const reg of registrations) {

//     // const winner = winners.find(
//     //   w => w.participantId === reg.studentId
//     // );

//     const winner = winners.find(w => {

//   // Individual winner
//   if (w.type === "student") {
//     return w.participantId === reg.studentId;
//   }

//   // Team winner
//   if (w.type === "team") {
//     return w.participantId === reg.teamId;
//   }

// });

//     const isWinner = !!winner;

//     const template = isWinner
//       ? winnerTemplate
//       : participationTemplate;

//     // const user = await User.findOne({
//     //   userId: reg.studentId
//     // });

//      let displayName;

// if (reg.studentId) {

//   const user = await User.findOne({ userId: reg.studentId });
//   displayName = user.fullName;

// } else if (reg.teamId) {

//   const team = await Team.findOne({ teamId: reg.teamId });
//   displayName = team.teamName;
// }

    
//     const pdfPath = await generateCertificatePDF({
//       name: user.fullName,
//       competitionName: competition.name,
//       position: isWinner ? winner.position : null,
//       templatePath: template.templatePath,
//       textConfig: template.textConfig
//     });

//     const cert = await Certificate.create({
//       certificateId: uuidv4(),
//       competitionId,
//       userId: reg.studentId,
//       type: isWinner ? "winner" : "participation",
//       position: isWinner ? winner.position : null,
//       pdfUrl: pdfPath
//     });

//     // 🔥 IMPORTANT FLAG
//     reg.certificateGenerated = true;
//     await reg.save();

//     generatedCertificates.push(cert);
//   }

//   res.json({
//     message: "Certificates generated successfully",
//     generatedCount: generatedCertificates.length
//   });
// };

// export const getMyCertificates = async (req, res) => {

//   const certificates = await Certificate.find({
//     userId: req.user.userId
//   });

//   res.json(certificates);
// };

import { v4 as uuidv4 } from "uuid";
import Certificate from "../models/Certificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import Registration from "../models/Registration.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import Competition from "../models/Competition.js";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";


// ================= GENERATE CERTIFICATES =================

export const generateCertificates = async (req, res) => {

  const { competitionId } = req.body;

  if (!competitionId) {
    return res.status(400).json({
      message: "competitionId required"
    });
  }

  // ---------------- FETCH COMPETITION ----------------

  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({
      message: "Competition not found"
    });
  }

  // ---------------- AUTO TEMPLATE TYPE ----------------

  let participationType;
  let winnerType;

  if (competition.eventType === "team") {
    participationType = "participant_hackathon";
    winnerType = "winner_hackathon";
  } else {
    participationType = "participation";
    winnerType = "winner";
  }

  // ---------------- FETCH TEMPLATES ----------------

  const participationTemplate = await CertificateTemplate.findOne({
    competitionId,
    type: participationType
  });

  const winnerTemplate = await CertificateTemplate.findOne({
    competitionId,
    type: winnerType
  });

  if (!participationTemplate || !winnerTemplate) {
    return res.status(400).json({
      message: "Required certificate templates not uploaded"
    });
  }

  // ---------------- FETCH ELIGIBLE REGISTRATIONS ----------------

  const registrations = await Registration.find({
    competitionId,
    status: "attended",
    certificateGenerated: false
  });

  if (registrations.length === 0) {
    return res.json({
      message: "No new certificates to generate"
    });
  }

  // ---------------- FETCH WINNERS ----------------

  const winners = await Result.find({ competitionId });

  let generatedCount = 0;

  // ---------------- MAIN LOOP ----------------

  for (const reg of registrations) {

    // ---------- Check Winner ----------

    const winner = winners.find(w => {

      if (w.type === "student") {
        return w.participantId === reg.studentId;
      }

      if (w.type === "team") {
        return w.participantId === reg.teamId;
      }

    });

    const isWinner = !!winner;

    const template = isWinner
      ? winnerTemplate
      : participationTemplate;

    // ================= TEAM COMPETITION =================

    if (competition.type === "team" && reg.teamId) {

      const team = await Team.findOne({ teamId: reg.teamId });

      if (!team) continue;

      for (const memberId of team.members) {

        const user = await User.findOne({ userId: memberId });

        if (!user) continue;

        const pdfPath = await generateCertificatePDF({
          name: user.fullName,
          teamName: team.teamName,
          competitionName: competition.name,
          position: isWinner ? winner.position : null,
          templatePath: template.templatePath,
          textConfig: template.textConfig
        });

        await Certificate.create({
          certificateId: uuidv4(),
          competitionId,
          userId: memberId,
          teamId: team.teamId,
          type: isWinner ? "winner" : "participation",
          position: isWinner ? winner.position : null,
          pdfUrl: pdfPath
        });

        generatedCount++;
      }

    }

    // ================= INDIVIDUAL COMPETITION =================

    else {

      const user = await User.findOne({ userId: reg.studentId });

      if (!user) continue;

      const pdfPath = await generateCertificatePDF({
        name: user.fullName,
        competitionName: competition.name,
        position: isWinner ? winner.position : null,
        templatePath: template.templatePath,
        textConfig: template.textConfig
      });

      await Certificate.create({
        certificateId: uuidv4(),
        competitionId,
        userId: reg.studentId,
        type: isWinner ? "winner" : "participation",
        position: isWinner ? winner.position : null,
        pdfUrl: pdfPath
      });

      generatedCount++;
    }

    // ---------- Mark Registration Done ----------

    reg.certificateGenerated = true;
    await reg.save();
  }

  res.json({
    message: "Certificates generated successfully",
    generatedCount
  });

};


// ================= STUDENT VIEW CERTIFICATES =================

export const getMyCertificates = async (req, res) => {

  const certificates = await Certificate.find({
    userId: req.user.userId
  });

  res.json(certificates);
};

