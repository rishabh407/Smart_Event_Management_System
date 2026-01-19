import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { declareResults } from "../controllers/result.controller.js";

const router = express.Router();

router.post("/declare", protect, declareResults);

export default router;
