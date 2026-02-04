// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import { teacherOnly } from "../middlewares/role.middleware.js";
// import { uploadTemplate } from "../controllers/certificateTemplate.controller.js";
// import { uploadTemplateMiddleware } from "../middlewares/certificateUpload.js";
// import { deleteTemplate } from "../controllers/certificateTemplate.controller.js";

// const router = express.Router();

// router.post(
//   "/upload",
//   protect,
//   teacherOnly,
//   uploadTemplateMiddleware.single("file"),
//   uploadTemplate
// );



// router.delete("/:templateId", protect, teacherOnly, deleteTemplate);

// export default router;

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { uploadTemplate, previewTemplate } from "../controllers/certificateTemplate.controller.js";
import { uploadTemplateMiddleware } from "../middlewares/certificateUpload.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  teacherOnly,
  uploadTemplateMiddleware.fields([
    { name: "participationTemplate", maxCount: 1 },
    { name: "winnerTemplate", maxCount: 1 }
  ]),
  uploadTemplate
);

// One‑off preview endpoint – does NOT persist templates in DB
router.post(
  "/preview",
  protect,
  teacherOnly,
  uploadTemplateMiddleware.fields([
    { name: "participationTemplate", maxCount: 1 },
    { name: "winnerTemplate", maxCount: 1 }
  ]),
  previewTemplate
);

export default router;
