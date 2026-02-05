import path from "path";
import fs from "fs";

import CertificateTemplate from "../models/CertificateTemplate.js";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";

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

// Generate a one-off preview certificate PDF without saving template config to DB.
// Teachers can use this to fine‑tune coordinates using a fake student.
export const previewTemplate = async (req, res) => {
  try {
    const {
      type = "participation",
      participationPositions,
      winnerPositions,
      competitionName = "Sample Competition"
    } = req.body;

    const isWinner = type === "winner";
    const fileField = isWinner ? "winnerTemplate" : "participationTemplate";

    if (!req.files?.[fileField] || !req.files[fileField][0]) {
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
    } catch (err) {
      return res.status(400).json({
        message: "Invalid positions JSON for preview"
      });
    }

    // Use fixed fake values so teachers can see approximate placement
    const pdfPath = await generateCertificatePDF({
      name: "Sample Student",
      teamName: "Sample Team",
      competitionName,
      position: isWinner ? 1 : null,
      templatePath,
      textConfig: textConfig || {}
    });

    // Ensure absolute path for sendFile
    const absolutePdfPath = path.isAbsolute(pdfPath)
      ? pdfPath
      : path.join(process.cwd(), pdfPath);

    return res.sendFile(absolutePdfPath, (err) => {
      if (err) {
        console.error("PREVIEW SEND FILE ERROR:", err);
        if (!res.headersSent) {
          res.status(500).end();
        }
      }

      // Best‑effort cleanup of generated preview PDF
      fs.unlink(absolutePdfPath, () => {});
    });
  } catch (error) {
    console.error("TEMPLATE PREVIEW ERROR:", error);
    return res.status(500).json({
      message: "Template preview failed"
    });
  }
};
