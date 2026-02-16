// import path from "path";
// import fs from "fs";

// import CertificateTemplate from "../models/CertificateTemplate.js";
// import { generateCertificatePDF } from "../utils/certificateGenerator.js";

// export const uploadTemplate = async (req, res) => {

//   try {

//     const {
//       competitionId,
//       participationPositions,
//       winnerPositions
//     } = req.body;

//     // Validate
//     if (!competitionId) {
//       return res.status(400).json({
//         message: "Competition ID missing"
//       });
//     }

//     if (
//       !req.files?.participationTemplate ||
//       !req.files?.winnerTemplate
//     ) {
//       return res.status(400).json({
//         message: "Both templates are required"
//       });
//     }

//     // Prevent duplicate upload
//     const existing = await CertificateTemplate.findOne({
//       competition: competitionId
//     });

//     if (existing) {
//       return res.status(400).json({
//         message: "Template already uploaded for this competition"
//       });
//     }

//     const participationPath =
//       req.files.participationTemplate[0].path;

//     const winnerPath =
//       req.files.winnerTemplate[0].path;

//     const template = await CertificateTemplate.create({

//       competition: competitionId,

//       participationTemplate: participationPath,

//       winnerTemplate: winnerPath,

//       participationPositions: JSON.parse(participationPositions),

//       winnerPositions: JSON.parse(winnerPositions),

//     });

//     res.status(201).json({
//       message: "Templates uploaded successfully",
//       template
//     });

//   } catch (error) {

//     console.error("TEMPLATE UPLOAD ERROR:", error);

//     res.status(500).json({
//       message: "Template upload failed"
//     });

//   }

// };

// export const previewTemplate = async (req, res) => {
//   try {
//     const {
//       type = "participation",
//       participationPositions,
//       winnerPositions,
//       competitionName = "Sample Competition"
//     } = req.body;

//     const isWinner = type === "winner";
//     const fileField = isWinner ? "winnerTemplate" : "participationTemplate";

//     if (!req.files?.[fileField]?.[0]) {
//       return res.status(400).json({
//         message: `Template image for ${isWinner ? "winner" : "participation"} certificate is required for preview`
//       });
//     }

//     const templatePath = req.files[fileField][0].path;

//     let textConfig = {};
//     try {
//       if (isWinner && winnerPositions) {
//         textConfig = JSON.parse(winnerPositions);
//       } else if (!isWinner && participationPositions) {
//         textConfig = JSON.parse(participationPositions);
//       }
//     } catch {
//       return res.status(400).json({
//         message: "Invalid positions JSON for preview"
//       });
//     }

//     console.log("TEMPLATE PATH:", templatePath);
//     console.log("TEXT CONFIG:", textConfig);

//     const pdfPath = await generateCertificatePDF({
//       name: "Sample Student",
//       teamName: "Sample Team",
//       competitionName,
//       position: isWinner ? 1 : null,
//       templatePath,
//       textConfig
//     });

//     console.log("PDF GENERATED AT:", pdfPath);

//     // 🔥 THIS WAS MISSING
//     const absolutePdfPath = path.isAbsolute(pdfPath)
//       ? pdfPath
//       : path.join(process.cwd(), pdfPath);

//     if (!fs.existsSync(absolutePdfPath)) {
//       console.error("PDF NOT FOUND:", absolutePdfPath);
//       return res.status(500).json({
//         message: "Preview PDF could not be generated"
//       });
//     }

//     return res.sendFile(absolutePdfPath, (err) => {
//       if (err) {
//         console.error("PREVIEW SEND FILE ERROR:", err);
//       }

//       setTimeout(() => {
//         fs.unlink(absolutePdfPath, () => {});
//       }, 3000);
//     });

//   } catch (error) {
//     console.error("TEMPLATE PREVIEW ERROR:", error);
//     return res.status(500).json({
//       message: "Template preview failed"
//     });
//   }
// };

import path from "path";
import fs from "fs";

import CertificateTemplate from "../models/CertificateTemplate.js";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";

export const uploadTemplate = async (req, res) => {
  try {
    const {
      competitionId,
      participationPositions,
      winnerPositions,
      isTeam // NEW: Add this
    } = req.body;

    // Validate
    if (!competitionId) {
      return res.status(400).json({
        message: "Competition ID missing"
      });
    }

    if (
      !req.files?.participationTemplate ||
      !req.files?.winnerTemplate
    ) {
      return res.status(400).json({
        message: "Both templates are required"
      });
    }

    // Prevent duplicate upload
    const existing = await CertificateTemplate.findOne({
      competition: competitionId
    });

    if (existing) {
      return res.status(400).json({
        message: "Template already uploaded for this competition"
      });
    }

    const participationPath = req.files.participationTemplate[0].path;
    const winnerPath = req.files.winnerTemplate[0].path;

    const template = await CertificateTemplate.create({
      competition: competitionId,
      participationTemplate: participationPath,
      winnerTemplate: winnerPath,
      participationPositions: JSON.parse(participationPositions),
      winnerPositions: JSON.parse(winnerPositions),
      isTeam: isTeam === "true" || isTeam === true // NEW: Store team flag
    });

    res.status(201).json({
      message: "Templates uploaded successfully",
      template
    });

  } catch (error) {
    console.error("TEMPLATE UPLOAD ERROR:", error);
    res.status(500).json({
      message: "Template upload failed"
    });
  }
};

export const previewTemplate = async (req, res) => {
  try {
    const {
      type = "participation",
      participationPositions,
      winnerPositions,
      competitionName = "Sample Competition",
      isTeam // NEW: Add this
    } = req.body;

    const isWinner = type === "winner";
    const isTeamCompetition = isTeam === "true" || isTeam === true;
    const fileField = isWinner ? "winnerTemplate" : "participationTemplate";

    if (!req.files?.[fileField]?.[0]) {
      return res.status(400).json({
        message: `Template image for ${isWinner ? "winner" : "participation"} certificate is required for preview`
      });
    }

    const templatePath = req.files[fileField][0].path;

    let textConfig = {};
    try {
      if (isWinner && winnerPositions) {
        textConfig = JSON.parse(winnerPositions);
      } else if (!isWinner && participationPositions) {
        textConfig = JSON.parse(participationPositions);
      }
    } catch {
      return res.status(400).json({
        message: "Invalid positions JSON for preview"
      });
    }

    console.log("TEMPLATE PATH:", templatePath);
    console.log("TEXT CONFIG:", textConfig);
    console.log("IS TEAM COMPETITION:", isTeamCompetition);
    console.log("IS WINNER:", isWinner);

    const pdfPath = await generateCertificatePDF({
      name: "Sample Student Name",
      teamName: isTeamCompetition ? "Sample Team Name" : null,
      competitionName, // Passed but won't be rendered in PDF
      position: isWinner ? 1 : null,
      templatePath,
      textConfig,
      isTeam: isTeamCompetition // NEW: Pass team flag to generator
    });

    console.log("PDF GENERATED AT:", pdfPath);

    const absolutePdfPath = path.isAbsolute(pdfPath)
      ? pdfPath
      : path.join(process.cwd(), pdfPath);

    if (!fs.existsSync(absolutePdfPath)) {
      console.error("PDF NOT FOUND:", absolutePdfPath);
      return res.status(500).json({
        message: "Preview PDF could not be generated"
      });
    }

    return res.sendFile(absolutePdfPath, (err) => {
      if (err) {
        console.error("PREVIEW SEND FILE ERROR:", err);
      }

      // Clean up temporary preview file after sending
      setTimeout(() => {
        fs.unlink(absolutePdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete preview file:", unlinkErr);
          }
        });
      }, 3000);
    });

  } catch (error) {
    console.error("TEMPLATE PREVIEW ERROR:", error);
    return res.status(500).json({
      message: "Template preview failed"
    });
  }
};