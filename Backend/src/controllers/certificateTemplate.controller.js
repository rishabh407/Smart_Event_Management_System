// import { v4 as uuidv4 } from "uuid";
// import CertificateTemplate from "../models/CertificateTemplate.js";


// export const uploadTemplate = async (req, res) => {
//   console.log("BODY:", req.body);
// console.log("FILE:", req.file);

//   const { competitionId, type } = req.body;

//   if (!competitionId || !type || !req.file) {
//     return res.status(400).json({
//       message: "Missing template data"
//     });
//   }

//   // Build template path automatically
//   const templatePath = `assets/certificates/${req.file.filename}`;

//   // Build textConfig from form-data fields
//   const textConfig = {
//     nameX: req.body.nameX,
//     nameY: req.body.nameY,

//     teamX: req.body.teamX,
//     teamY: req.body.teamY,

//     competitionX: req.body.competitionX,
//     competitionY: req.body.competitionY,

//     positionX: req.body.positionX,
//     positionY: req.body.positionY
//   };

//   const template = await CertificateTemplate.create({
//     templateId: uuidv4(),
//     competitionId,
//     type,
//     templatePath,
//     textConfig
//   });

//   res.status(201).json({
//     message: "Template uploaded successfully",
//     template
//   });
// };


import { v4 as uuidv4 } from "uuid";
import CertificateTemplate from "../models/CertificateTemplate.js";

export const uploadTemplate = async (req, res) => {

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const competitionId = req.body.competitionId?.trim();
  const type = req.body.type?.trim();

  if (!competitionId || !type || !req.file) {
    return res.status(400).json({
      message: "Missing template data"
    });
  }

  // ✅ Always use multer filename
  const templatePath = `assets/certificates/${req.file.filename}`;

  // ✅ Convert coordinates to Number
  // const textConfig = {
  //   nameX: Number(req.body.nameX),
  //   nameY: Number(req.body.nameY),

  //   teamX: Number(req.body.teamX),
  //   teamY: Number(req.body.teamY),

  //   competitionX: Number(req.body.competitionX),
  //   competitionY: Number(req.body.competitionY),

  //   positionX: Number(req.body.positionX),
  //   positionY: Number(req.body.positionY)
  // };

const textConfig = {

  ...(req.body.nameX && { nameX: Number(req.body.nameX) }),
  ...(req.body.nameY && { nameY: Number(req.body.nameY) }),

  ...(req.body.teamX && { teamX: Number(req.body.teamX) }),
  ...(req.body.teamY && { teamY: Number(req.body.teamY) }),

  ...(req.body.competitionX && { competitionX: Number(req.body.competitionX) }),
  ...(req.body.competitionY && { competitionY: Number(req.body.competitionY) }),

  ...(req.body.positionX && { positionX: Number(req.body.positionX) }),
  ...(req.body.positionY && { positionY: Number(req.body.positionY) })

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
