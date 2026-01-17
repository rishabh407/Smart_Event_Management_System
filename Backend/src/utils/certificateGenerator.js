// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const generateCertificatePDF = async ({
//   name,
//   position,
//   templatePath,
//   textConfig
// }) => {
//   const certificatesDir = "certificates";

//   // Create certificates folder if not exists
//   if (!fs.existsSync(certificatesDir)) {
//     fs.mkdirSync(certificatesDir);
//   }

//   const doc = new PDFDocument({
//     size: "A4",
//     layout: "landscape"
//   });

//   const outputPath = `${certificatesDir}/${Date.now()}-${name}.pdf`;

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   // Resolve template absolute path
//   const resolvedTemplatePath = path.resolve(templatePath);

//   // Safety check
//   if (!fs.existsSync(resolvedTemplatePath)) {
//     throw new Error("Certificate template file not found");
//   }

//   // Draw background template
//   doc.image(resolvedTemplatePath, 0, 0, {
//     width: 842
//   });

//   // Student Name
//   doc.fontSize(30)
//     .fillColor("black")
//     .text(name, textConfig.nameX, textConfig.nameY);

//   // // Competition Name
//   // doc.fontSize(20)
//   //   .text(
//   //     competitionName,
//   //     textConfig.competitionX,
//   //     textConfig.competitionY
//   //   );

//   // Winner Position
//   if (position) {
//     doc.fontSize(22)
//       .text(
//         position,
//         textConfig.positionX,
//         textConfig.positionY
//       );
//   }

//   doc.end();

//   return new Promise((resolve) => {
//     stream.on("finish", () => resolve(outputPath));
//   });
// };


// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const generateCertificatePDF = async ({
//   name,
//   teamName,
//   position,
//   templatePath,
//   textConfig
// }) => {

//   const certificatesDir = "certificates";
   
//   if (!fs.existsSync(certificatesDir)) {
//     fs.mkdirSync(certificatesDir);
//   }

//   const doc = new PDFDocument({
//     size: "A4",
//     layout: "landscape"
//   });

//   const outputPath = `${certificatesDir}/${Date.now()}-${name}.pdf`;

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   // const resolvedTemplatePath = path.resolve(templatePath);

// const resolvedTemplatePath = path.join(
//   __dirname,
//   "..",
//   "..",
//   templatePath
// );
// console.log("TEMPLATE PATH:", resolvedTemplatePath);


//   if (!fs.existsSync(resolvedTemplatePath)) {
//     throw new Error("Certificate template file not found");
//   }

//   // Draw background image
//   doc.image(resolvedTemplatePath, 0, 0, {
//     width: 842
//   });

//   // -------- Student Name --------
//   doc.fontSize(30)
//     .fillColor("black")
//     .text(name, textConfig.nameX, textConfig.nameY);

//   // -------- Team Name (Hackathon) --------
//   if (teamName && textConfig.teamX && textConfig.teamY) {
//     doc.fontSize(22)
//       .fillColor("black")
//       .text(teamName, textConfig.teamX, textConfig.teamY);
//   }

//   // -------- Winner Position --------
//   if (position && textConfig.positionX && textConfig.positionY) {
//     doc.fontSize(22)
//       .fillColor("black")
//       .text(
//         position,
//         textConfig.positionX,
//         textConfig.positionY
//       );
//   }

//   doc.end();

//   return new Promise((resolve) => {
//     stream.on("finish", () => resolve(outputPath));
//   });
// };


import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({
  name,
  teamName,
  position,
  templatePath,
  textConfig
}) => {

  try {

    console.log("PDF FUNCTION CALLED");
    console.log("DB TEMPLATE PATH =>", templatePath);

    // ================= BASE PROJECT ROOT =================
    // utils folder -> src -> Backend
    const projectRoot = path.join(__dirname, "..", "..");

    // ================= OUTPUT CERTIFICATE FOLDER =================

    const certificatesDir = path.join(projectRoot, "certificates");

    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const outputPath = path.join(
      certificatesDir,
      `${Date.now()}-${name}.pdf`
    );

    // ================= FIX TEMPLATE PATH =================

    // Convert Windows "\" to "/"
    const safeTemplatePath = templatePath.replace(/\\/g, "/");

    const resolvedTemplatePath = path.join(
      projectRoot,
      safeTemplatePath
    );

    console.log("FINAL TEMPLATE PATH =>", resolvedTemplatePath);
    console.log("FILE EXISTS =>", fs.existsSync(resolvedTemplatePath));

    if (!fs.existsSync(resolvedTemplatePath)) {
      throw new Error("Certificate template file not found at: " + resolvedTemplatePath);
    }

    // ================= CREATE PDF =================

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape"
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // ================= DRAW BACKGROUND =================

    doc.image(resolvedTemplatePath, 0, 0, {
      width: 842
    });

    // ================= DRAW STUDENT NAME =================

    doc.fontSize(30)
      .fillColor("black")
      .text(name, textConfig.nameX, textConfig.nameY);

    // ================= DRAW TEAM NAME =================

    if (teamName && textConfig.teamX && textConfig.teamY) {
      doc.fontSize(22)
        .fillColor("black")
        .text(teamName, textConfig.teamX, textConfig.teamY);
    }

    // ================= DRAW POSITION =================

    if (position && textConfig.positionX && textConfig.positionY) {
      doc.fontSize(22)
        .fillColor("black")
        .text(
          position,
          textConfig.positionX,
          textConfig.positionY
        );
    }

    doc.end();

    return new Promise((resolve, reject) => {

      stream.on("finish", () => {
        console.log("PDF GENERATED =>", outputPath);
        resolve(outputPath);
      });

      stream.on("error", (err) => {
        reject(err);
      });

    });

  } catch (error) {

    console.error("PDF GENERATION ERROR =>", error);
    throw error;

  }
};
