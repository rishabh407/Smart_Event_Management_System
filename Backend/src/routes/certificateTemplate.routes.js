import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { uploadTemplate } from "../controllers/certificateTemplate.controller.js";
import { uploadTemplateMiddleware } from "../middlewares/uploadTemplateinMulter.js";

const router = express.Router();

router.post("/upload", protect,uploadTemplateMiddleware.single("file"), teacherOnly, uploadTemplate);

export default router;
