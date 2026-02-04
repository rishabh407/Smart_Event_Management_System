// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//     cb(null, "assets/certificates");
//   },

//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }

// });

// export const uploadTemplateMiddleware = multer({
//   storage
// });

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Ensure we always save inside Backend/uploads/certificates
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/certificates");

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    } catch (err) {
      return cb(err, uploadPath);
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },

});

// Only allow image files that PDFKit supports as background (PNG/JPEG)
const fileFilter = (req, file, cb) => {

  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG or JPEG image files are allowed for certificate templates"), false);
  }

};

export const uploadTemplateMiddleware = multer({
  storage,
  fileFilter,
});
