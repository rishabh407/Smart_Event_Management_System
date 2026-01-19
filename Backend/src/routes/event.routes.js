import express from "express";
import { createEvent } from "../controllers/event.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, hodOnly, createEvent);

export default router;
