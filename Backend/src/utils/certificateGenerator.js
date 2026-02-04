import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({
  name,
  teamName,
  competitionName,
  position,
  templatePath,
  textConfig,
}) => {
  try {

    // ================= PROJECT ROOT =================

    const projectRoot = path.join(__dirname, "..", "..");

    // ================= CERTIFICATE OUTPUT FOLDER =================

    const certificatesDir = path.join(projectRoot, "certificates");

    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // ================= SAFE FILE NAME =================

    const safeName = name.replace(/[^a-zA-Z0-9]/g, "_");

    const outputPath = path.join(
      certificatesDir,
      `${Date.now()}_${safeName}.pdf`
    );

    // ================= TEMPLATE PATH RESOLUTION =================

    let resolvedTemplatePath;

    if (path.isAbsolute(templatePath)) {
      // When Multer saved with an absolute path (uploads/certificates)
      resolvedTemplatePath = templatePath;
    } else {
      // Backward compatibility: stored as relative to project root
      const safeTemplatePath = templatePath.replace(/\\/g, "/");
      resolvedTemplatePath = path.join(projectRoot, safeTemplatePath);
    }

    if (!fs.existsSync(resolvedTemplatePath)) {
      throw new Error("Template file not found: " + resolvedTemplatePath);
    }

    // ================= CREATE PDF =================

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // ================= DRAW BACKGROUND =================

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.image(resolvedTemplatePath, 0, 0, {
      width: pageWidth,
      height: pageHeight,
    });

    // ================= DRAW STUDENT NAME =================

    if (textConfig.nameX && textConfig.nameY) {
      doc
        .fontSize(30)
        .fillColor("black")
        .text(name, textConfig.nameX, textConfig.nameY, {
          width: 600,
          align: "center",
        });
    }

    // ================= DRAW TEAM NAME =================

    if (
      teamName &&
      textConfig.teamX &&
      textConfig.teamY
    ) {
      doc
        .fontSize(22)
        .fillColor("black")
        .text(teamName, textConfig.teamX, textConfig.teamY, {
          width: 600,
          align: "center",
        });
    }

    // ================= DRAW COMPETITION NAME =================

    if (
      competitionName &&
      textConfig.competitionX &&
      textConfig.competitionY
    ) {
      doc
        .fontSize(22)
        .fillColor("black")
        .text(
          competitionName,
          textConfig.competitionX,
          textConfig.competitionY,
          {
            width: 600,
            align: "center",
          }
        );
    }

    // ================= DRAW POSITION =================

    if (
      position &&
      textConfig.positionX &&
      textConfig.positionY
    ) {
      doc
        .fontSize(22)
        .fillColor("black")
        .text(
          position.toString(),
          textConfig.positionX,
          textConfig.positionY,
          {
            width: 200,
            align: "center",
          }
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
