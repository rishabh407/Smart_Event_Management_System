// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "assets/uploadedcertificates");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// export const uploadTemplateMiddleware = multer({
//   storage
// }).single("file");

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "assets", "certificates"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

// IMPORTANT: export multer instance
export const uploadTemplateMiddleware = multer({ storage });
