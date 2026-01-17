import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { generateCertificates } from "../controllers/certificate.controller.js";

const router = express.Router();

router.post("/generate", protect, teacherOnly, generateCertificates);

export default router;
