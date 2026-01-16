import { v4 as uuidv4 } from "uuid";
import CertificateTemplate from "../models/CertificateTemplate.js";

export const uploadTemplate = async (req, res) => {
  const { competitionId, type, templateImage, textConfig } = req.body;

  if (!competitionId || !type || !templateImage) {
    return res.status(400).json({
      message: "Missing template data"
    });
  }

  const template = await CertificateTemplate.create({
    templateId: uuidv4(),
    competitionId,
    type,
    templateImage,
    textConfig
  });

  res.status(201).json({
    message: "Template uploaded successfully",
    template
  });
};
