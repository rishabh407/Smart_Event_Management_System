import { v4 as uuidv4 } from "uuid";
import CertificateTemplate from "../models/CertificateTemplate.js";


export const uploadTemplate = async (req, res) => {
  console.log("BODY:", req.body);
console.log("FILE:", req.file);

  const { competitionId, type } = req.body;

  if (!competitionId || !type || !req.file) {
    return res.status(400).json({
      message: "Missing template data"
    });
  }

  // Build template path automatically
  const templatePath = `assets/certificates/${req.file.filename}`;

  // Build textConfig from form-data fields
  const textConfig = {
    nameX: req.body.nameX,
    nameY: req.body.nameY,

    teamX: req.body.teamX,
    teamY: req.body.teamY,

    competitionX: req.body.competitionX,
    competitionY: req.body.competitionY,

    positionX: req.body.positionX,
    positionY: req.body.positionY
  };

  const template = await CertificateTemplate.create({
    templateId: uuidv4(),
    competitionId,
    type,
    templatePath,
    textConfig
  });

  res.status(201).json({
    message: "Template uploaded successfully",
    template
  });
};
