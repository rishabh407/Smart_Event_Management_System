import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import { generateCertificates, getMyCertificates } from "../controllers/certificate.controller.js";

const router = express.Router();

router.post("/generate", protect, teacherOnly, generateCertificates);
router.get("/my", protect, getMyCertificates);

export default router;


