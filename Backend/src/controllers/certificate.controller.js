import Certificate from "../models/Certificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import Registration from "../models/Registration.js";
import Result from "../models/Result.js";
import Competition from "../models/Competition.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { generateCertificatePDF } from "../utils/certificateGenerator.js";

export const generateCertificates = async (req, res) => {

  try {

    const { competitionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: "Invalid competition id" });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    const participationType =
      competition.type === "team"
        ? "participant_hackathon"
        : "participation";

    const winnerType =
      competition.type === "team"
        ? "winner_hackathon"
        : "winner";

    const participationTemplate = await CertificateTemplate.findOne({
      competition: competitionId,
      type: participationType
    });

    const winnerTemplate = await CertificateTemplate.findOne({
      competition: competitionId,
      type: winnerType
    });

    if (!participationTemplate || !winnerTemplate) {
      return res.status(400).json({ message: "Templates missing" });
    }

    const registrations = await Registration.find({
      competition: competitionId,
      status: "attended",
      certificateGenerated: false
    });

    const results = await Result.find({ competition: competitionId });

    let count = 0;

    for (const reg of registrations) {

      const winner = results.find(r => {
        if (r.student && reg.student) return r.student.equals(reg.student);
        if (r.team && reg.team) return r.team.equals(reg.team);
        return false;
      });

      const isWinner = !!winner;
      const template = isWinner ? winnerTemplate : participationTemplate;

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
            position: isWinner ? winner.position : null,
            templatePath: template.templatePath,
            textConfig: template.textConfig
          });

          await Certificate.create({
            competition: competitionId,
            user: user._id,
            team: team._id,
            type: isWinner ? "winner" : "participation",
            position: isWinner ? winner.position : null,
            pdfUrl: pdfPath
          });

          count++;
        }

      } else {

        const user = await User.findById(reg.student);
        if (!user) continue;

        const pdfPath = await generateCertificatePDF({
          name: user.fullName,
          position: isWinner ? winner.position : null,
          templatePath: template.templatePath,
          textConfig: template.textConfig
        });

        await Certificate.create({
          competition: competitionId,
          user: user._id,
          type: isWinner ? "winner" : "participation",
          position: isWinner ? winner.position : null,
          pdfUrl: pdfPath
        });

        count++;
      }

      reg.certificateGenerated = true;
      await reg.save();
    }

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
  });

  res.json(certificates);
};

