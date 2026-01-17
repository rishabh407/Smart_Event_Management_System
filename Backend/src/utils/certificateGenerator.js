import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificatePDF = async ({
  name,
  position,
  templatePath,
  textConfig
}) => {
  const certificatesDir = "certificates";

  // Create certificates folder if not exists
  if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
  }

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape"
  });

  const outputPath = `${certificatesDir}/${Date.now()}-${name}.pdf`;

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Resolve template absolute path
  const resolvedTemplatePath = path.resolve(templatePath);

  // Safety check
  if (!fs.existsSync(resolvedTemplatePath)) {
    throw new Error("Certificate template file not found");
  }

  // Draw background template
  doc.image(resolvedTemplatePath, 0, 0, {
    width: 842
  });

  // Student Name
  doc.fontSize(30)
    .fillColor("black")
    .text(name, textConfig.nameX, textConfig.nameY);

  // // Competition Name
  // doc.fontSize(20)
  //   .text(
  //     competitionName,
  //     textConfig.competitionX,
  //     textConfig.competitionY
  //   );

  // Winner Position
  if (position) {
    doc.fontSize(22)
      .text(
        position,
        textConfig.positionX,
        textConfig.positionY
      );
  }

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(outputPath));
  });
};


// import PDFDocument from "pdfkit";
// import fs from "fs";

// export const generateCertificatePDF = async ({
//   name,
//   // competitionName,
//   position,
//   templatePath,
//   textConfig
// }) => {

//   return new Promise((resolve) => {

//     const dir = "certificates";

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     const doc = new PDFDocument({
//       size: "A4",
//       layout: "landscape"
//     });

//     const fileName = `certificate-${Date.now()}.pdf`;
//     const outputPath = `${dir}/${fileName}`;

//     doc.pipe(fs.createWriteStream(outputPath));

//     // Draw background template
//     doc.image(templatePath, 0, 0, {
//       width: doc.page.width,
//       height: doc.page.height
//     });

//     // NAME
//     doc.text(
//       name,
//       textConfig.nameX,
//       textConfig.nameY
//     );


//     // POSITION ONLY FOR WINNERS
//     if (position !== null && position !== undefined) {

//       let formattedPosition = position;

//       if (position === 1) formattedPosition = "1st";
//       if (position === 2) formattedPosition = "2nd";
//       if (position === 3) formattedPosition = "3rd";

//       doc.text(
//         formattedPosition,
//         textConfig.positionX,
//         textConfig.positionY
//       );
//     }

//     doc.end();

//     resolve(outputPath);
//   });
// };
