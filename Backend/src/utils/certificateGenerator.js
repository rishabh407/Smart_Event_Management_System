










































































































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
  isTeam = false, 
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

    
    doc.image(resolvedTemplatePath, 0, 0, {
      width: pageWidth,
      height: pageHeight,
    });

    
    if (textConfig.nameX && textConfig.nameY) {
      doc.fontSize(30).fillColor("black").text(
        name,
        textConfig.nameX,
        textConfig.nameY,
        { width: 600, align: "center" }
      );
    }

    
    if (isTeam && teamName && textConfig.teamX && textConfig.teamY) {
      doc.fontSize(22).fillColor("black").text(
        teamName,
        textConfig.teamX,
        textConfig.teamY,
        { width: 600, align: "center" }
      );
    }

    
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


const getPositionText = (position) => {
  const positionNum = parseInt(position);
  
  if (positionNum === 1) return "1st";
  if (positionNum === 2) return "2nd";
  if (positionNum === 3) return "3rd";
  
  return `${positionNum}th`;
};