import { v4 as uuidv4 } from "uuid";
import Certificate from "../models/Certificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import Registration from "../models/Registration.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";
import Competition from "../models/Competition.js";

// export const generateCertificates = async (req, res) => {
//   const { competitionId } = req.body;

//   if (!competitionId) {
//     return res.status(400).json({
//       message: "competitionId required"
//     });
//   }

//   // Get templates
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

//   // Get attendance list
//   const registrations = await Registration.find({
//     competitionId,
//     status: "attended"
//   });

//   // Get winners
//   const winners = await Result.find({ competitionId });

//   const generatedCertificates = [];

//   for (const reg of registrations) {
//     const winner = winners.find(
//       w => w.participantId === reg.studentId
//     );

//     const isWinner = !!winner;

//     const template = isWinner
//       ? winnerTemplate
//       : participationTemplate;

//     const user = await User.findOne({
//       userId: reg.studentId
//     });

//     const competition = await Competition.findOne({ competitionId });
// if (!competition) {
//   return res.status(404).json({
//     message: "Competition not found"
//   });
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

//     generatedCertificates.push(cert);
//   }

//   res.json({
//     message: "Certificates generated successfully",
//     count: generatedCertificates.length
//   });
// };

export const generateCertificates = async (req, res) => {
  const { competitionId } = req.body;

  if (!competitionId) {
    return res.status(400).json({
      message: "competitionId required"
    });
  }

  const participationTemplate = await CertificateTemplate.findOne({
    competitionId,
    type: "participation"
  });

  const winnerTemplate = await CertificateTemplate.findOne({
    competitionId,
    type: "winner"
  });

  if (!participationTemplate || !winnerTemplate) {
    return res.status(400).json({
      message: "Both templates required"
    });
  }

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

  const winners = await Result.find({ competitionId });

  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({
      message: "Competition not found"
    });
  }

  const generatedCertificates = [];

  for (const reg of registrations) {

    const winner = winners.find(
      w => w.participantId === reg.studentId
    );

    const isWinner = !!winner;

    const template = isWinner
      ? winnerTemplate
      : participationTemplate;

    const user = await User.findOne({
      userId: reg.studentId
    });

    const pdfPath = await generateCertificatePDF({
      name: user.fullName,
      competitionName: competition.name,
      position: isWinner ? winner.position : null,
      templatePath: template.templatePath,
      textConfig: template.textConfig
    });

    const cert = await Certificate.create({
      certificateId: uuidv4(),
      competitionId,
      userId: reg.studentId,
      type: isWinner ? "winner" : "participation",
      position: isWinner ? winner.position : null,
      pdfUrl: pdfPath
    });

    // 🔥 IMPORTANT FLAG
    reg.certificateGenerated = true;
    await reg.save();

    generatedCertificates.push(cert);
  }

  res.json({
    message: "Certificates generated successfully",
    generatedCount: generatedCertificates.length
  });
};

export const getMyCertificates = async (req, res) => {

  const certificates = await Certificate.find({
    userId: req.user.userId
  });

  res.json(certificates);
};
