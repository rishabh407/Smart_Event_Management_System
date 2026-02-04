// import CertificateTemplate from "../models/CertificateTemplate.js";
// import Competition from "../models/Competition.js";
// import mongoose from "mongoose";
// import fs from "fs";
// import path from "path";

// export const uploadTemplate = async (req, res) => {

//   try {

//     const { competitionId, type } = req.body;

//     if (!competitionId || !type || !req.file) {
//       return res.status(400).json({
//         message: "Missing template data"
//       });
//     }
//       console.log(competitionId,type);
//     if (!mongoose.Types.ObjectId.isValid(competitionId)) {
//       return res.status(400).json({
//         message: "Invalid competition id"
//       });
//     }

//     const competition = await Competition.findById(competitionId);
//     console.log(competition);
//     if (!competition) {
//       return res.status(404).json({
//         message: "Competition not found"
//       });
//     }

//     const templatePath = `assets/certificates/${req.file.filename}`;

//     const textConfig = {
//       ...(req.body.nameX && { nameX: Number(req.body.nameX) }),
//       ...(req.body.nameY && { nameY: Number(req.body.nameY) }),
//       ...(req.body.teamX && { teamX: Number(req.body.teamX) }),
//       ...(req.body.teamY && { teamY: Number(req.body.teamY) }),
//       ...(req.body.positionX && { positionX: Number(req.body.positionX) }),
//       ...(req.body.positionY && { positionY: Number(req.body.positionY) })
//     };

//     const template = await CertificateTemplate.create({
//       competition: competitionId,
//       type,
//       templatePath,
//       textConfig
//     });

//     res.status(201).json({
//       message: "Template uploaded successfully",
//       template
//     });

//   } catch (error) {

//     console.error(error);
//     res.status(500).json({ message: error.message });

//   }
// };


// export const deleteTemplate = async (req, res) => {

//   try {

//     const { templateId } = req.params;

//     const template = await CertificateTemplate.findById(templateId);

//     if (!template) {
//       return res.status(404).json({
//         message: "Template not found"
//       });
//     }

//     // Fetch competition
//     const competition = await Competition.findById(template.competition);

//     if (!competition) {
//       return res.status(404).json({
//         message: "Competition not found"
//       });
//     }

//     // ================= AUTHORIZATION =================
//     // Only assigned INCHARGE teacher allowed

//     const isIncharge = competition.assignedTeachers.some(t =>
//       t.teacher.toString() === req.user._id.toString() &&
//       t.role === "INCHARGE"
//     );

//     if (!isIncharge) {
//       return res.status(403).json({
//         message: "Not authorized to delete this template"
//       });
//     }

//     // ================= DELETE FILE =================

//     const filePath = path.join(process.cwd(), template.templatePath);

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // ================= DELETE DB RECORD =================

//     await CertificateTemplate.findByIdAndDelete(templateId);

//     res.json({
//       message: "Template deleted successfully"
//     });

//   } catch (error) {

//     console.error(error);
//     res.status(500).json({
//       message: error.message
//     });

//   }
// };


import CertificateTemplate from "../models/CertificateTemplate.js";

export const uploadTemplate = async (req, res) => {

  try {

    const {
      competitionId,
      participationPositions,
      winnerPositions
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

    const participationPath =
      req.files.participationTemplate[0].path;

    const winnerPath =
      req.files.winnerTemplate[0].path;

    const template = await CertificateTemplate.create({

      competition: competitionId,

      participationTemplate: participationPath,

      winnerTemplate: winnerPath,

      participationPositions: JSON.parse(participationPositions),

      winnerPositions: JSON.parse(winnerPositions),

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
