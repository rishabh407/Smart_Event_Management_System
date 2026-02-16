// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// export const generateCertificatePDF = async ({
//   name,
//   teamName,
//   competitionName,
//   position,
//   templatePath,
//   textConfig,
// }) => {
//   try {
//     const projectRoot = path.join(__dirname, "..", "..");

//     const certificatesDir = path.join(projectRoot, "certificates");
//     if (!fs.existsSync(certificatesDir)) {
//       fs.mkdirSync(certificatesDir, { recursive: true });
//     }

//     const safeName = name.replace(/[^a-zA-Z0-9]/g, "_");
//     const fileName = `${Date.now()}_${safeName}.pdf`;
//     const outputPath = path.join(certificatesDir, fileName);

//     let resolvedTemplatePath;
//     if (path.isAbsolute(templatePath)) {
//       resolvedTemplatePath = templatePath;
//     } else {
//       resolvedTemplatePath = path.join(
//         projectRoot,
//         templatePath.replace(/^\/+/, "")
//       );
//     }

//     if (!fs.existsSync(resolvedTemplatePath)) {
//       throw new Error("Template file not found: " + resolvedTemplatePath);
//     }

//     const doc = new PDFDocument({
//       size: "A4",
//       layout: "landscape",
//       margin: 0,
//     });

//     const stream = fs.createWriteStream(outputPath);
//     doc.pipe(stream);

//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;

//     doc.image(resolvedTemplatePath, 0, 0, {
//       width: pageWidth,
//       height: pageHeight,
//     });

//     if (textConfig.nameX && textConfig.nameY) {
//       doc.fontSize(30).fillColor("black").text(
//         name,
//         textConfig.nameX,
//         textConfig.nameY,
//         { width: 600, align: "center" }
//       );
//     }

//     if (teamName && textConfig.teamX && textConfig.teamY) {
//       doc.fontSize(22).fillColor("black").text(
//         teamName,
//         textConfig.teamX,
//         textConfig.teamY,
//         { width: 600, align: "center" }
//       );
//     }

//     if (competitionName && textConfig.competitionX && textConfig.competitionY) {
//       doc.fontSize(22).fillColor("black").text(
//         competitionName,
//         textConfig.competitionX,
//         textConfig.competitionY,
//         { width: 600, align: "center" }
//       );
//     }

//     if (position && textConfig.positionX && textConfig.positionY) {
//       doc.fontSize(22).fillColor("black").text(
//         position.toString(),
//         textConfig.positionX,
//         textConfig.positionY,
//         { width: 200, align: "center" }
//       );
//     }

//     doc.end();

//     return new Promise((resolve, reject) => {
//       stream.on("finish", () => resolve(outputPath)); // ✅ FIX
//       stream.on("error", reject);
//     });

//   } catch (error) {
//     console.error("PDF GENERATION ERROR:", error);
//     throw error;
//   }
// };

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({
  name,
  teamName,
  competitionName, // We still receive it but won't render it
  position,
  templatePath,
  textConfig,
  isTeam = false, // NEW: Flag to determine if it's a team competition
}) => {
  try {
    const projectRoot = path.join(__dirname, "..", "..");

    const certificatesDir = path.join(projectRoot, "certificates");
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const safeName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${Date.now()}_${safeName}.pdf`;
    const outputPath = path.join(certificatesDir, fileName);

    let resolvedTemplatePath;
    if (path.isAbsolute(templatePath)) {
      resolvedTemplatePath = templatePath;
    } else {
      resolvedTemplatePath = path.join(
        projectRoot,
        templatePath.replace(/^\/+/, "")
      );
    }

    if (!fs.existsSync(resolvedTemplatePath)) {
      throw new Error("Template file not found: " + resolvedTemplatePath);
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Draw template image as background
    doc.image(resolvedTemplatePath, 0, 0, {
      width: pageWidth,
      height: pageHeight,
    });

    // ============== ALWAYS RENDER: Student Name ==============
    if (textConfig.nameX && textConfig.nameY) {
      doc.fontSize(30).fillColor("black").text(
        name,
        textConfig.nameX,
        textConfig.nameY,
        { width: 600, align: "center" }
      );
    }

    // ============== RENDER ONLY FOR TEAM COMPETITIONS: Team Name ==============
    if (isTeam && teamName && textConfig.teamX && textConfig.teamY) {
      doc.fontSize(22).fillColor("black").text(
        teamName,
        textConfig.teamX,
        textConfig.teamY,
        { width: 600, align: "center" }
      );
    }

    // ============== RENDER ONLY FOR WINNERS: Position ==============
    if (position && textConfig.positionX && textConfig.positionY) {
      const positionText = getPositionText(position);
      doc.fontSize(22).fillColor("black").text(
        positionText,
        textConfig.positionX,
        textConfig.positionY,
        { width: 200, align: "center" }
      );
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(outputPath));
      stream.on("error", reject);
    });

  } catch (error) {
    console.error("PDF GENERATION ERROR:", error);
    throw error;
  }
};

// Helper function to format position text (1 -> "1st", 2 -> "2nd", etc.)
const getPositionText = (position) => {
  const positionNum = parseInt(position);
  
  if (positionNum === 1) return "1st";
  if (positionNum === 2) return "2nd";
  if (positionNum === 3) return "3rd";
  
  return `${positionNum}th`;
};