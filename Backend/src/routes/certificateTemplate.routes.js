import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { uploadTemplate } from "../controllers/certificateTemplate.controller.js";

const router = express.Router();

router.post("/upload", protect, teacherOnly, uploadTemplate);

export default router;
