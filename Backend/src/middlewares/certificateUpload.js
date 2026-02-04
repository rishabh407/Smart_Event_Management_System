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

// Storage config
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/certificates");
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

// Only allow PDF
const fileFilter = (req, file, cb) => {

  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }

};

export const uploadTemplateMiddleware = multer({
  storage,
  fileFilter,
});
