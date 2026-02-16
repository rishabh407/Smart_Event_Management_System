import mongoose from "mongoose";
import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import Result from "../models/Result.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";
import path from "path"; // ✅ ADD THIS

export const generateCertificates = async (req, res) => {
  try {
    const { competitionId } = req.body;

    // ================= VALIDATION =================
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: "Invalid competition id" });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // 🔒 HARD BLOCK (MOST IMPORTANT)
    if (competition.certificatesGenerated) {
      return res.status(400).json({
        message: "Certificates already generated for this competition"
      });
    }

    // ================= TEMPLATE CHECK =================
    const templateConfig = await CertificateTemplate.findOne({
      competition: competitionId
    });

    if (!templateConfig) {
      return res.status(400).json({
        message: "Certificate templates not uploaded for this competition"
      });
    }

    // ================= DATA LOAD =================
    const registrations = await Registration.find({
      competition: competitionId,
      status: "attended",
      certificateGenerated: false
    });

    const results = await Result.find({ competition: competitionId });

    let count = 0;

    // ================= GENERATION LOOP =================
    for (const reg of registrations) {
      const winner = results.find(r => {
        if (r.student && reg.student) return r.student.equals(reg.student);
        if (r.team && reg.team) return r.team.equals(reg.team);
        return false;
      });

      const isWinner = !!winner;

      const templatePath = isWinner
        ? templateConfig.winnerTemplate
        : templateConfig.participationTemplate;

      const textConfig = isWinner
        ? templateConfig.winnerPositions
        : templateConfig.participationPositions;

      // ================= TEAM =================
      if (competition.type === "team") {
        const team = await Team.findById(reg.team);
        if (!team) continue;

        for (const memberId of team.members) {
          const user = await User.findById(memberId);
          if (!user) continue;

          const exists = await Certificate.findOne({
            competition: competitionId,
            user: user._id
          });
          if (exists) continue;

          const pdfPath = await generateCertificatePDF({
            name: user.fullName,
            teamName: team.teamName,
            competitionName: competition.name,
            position: isWinner ? winner.position : null,
            templatePath,
            textConfig: textConfig || {}
          });
        await Certificate.create({
  competition: competitionId,
  user: user._id,
  team: team._id,
  type: isWinner ? "winner" : "participation",
  position: isWinner ? winner.position : null,
  pdfUrl: `/certificates/${path.basename(pdfPath)}` // ✅ FIX
});


          count++;
        }
      } else {
        // ================= INDIVIDUAL =================
        const user = await User.findById(reg.student);
        if (!user) continue;

        const pdfPath = await generateCertificatePDF({
          name: user.fullName,
          competitionName: competition.name,
          position: isWinner ? winner.position : null,
          templatePath,
          textConfig: textConfig || {}
        });

        await Certificate.create({
          competition: competitionId,
          user: user._id,
          type: isWinner ? "winner" : "participation",
          position: isWinner ? winner.position : null,
           pdfUrl: `/certificates/${path.basename(pdfPath)}` // ✅ public URL
        });

        count++;
      }

      reg.certificateGenerated = true;
      await reg.save();
    }

    // 🔒 FINAL LOCK
    competition.certificatesGenerated = true;
    await competition.save();

    res.json({
      message: "Certificates generated successfully",
      generated: count
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyCertificates = async (req, res) => {

  const certificates = await Certificate.find({
    user: req.user._id
  })
    .populate("competition", "name startTime endTime")
    .populate("team", "teamName");

  res.json(certificates);
};