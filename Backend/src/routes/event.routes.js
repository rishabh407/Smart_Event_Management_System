import express from "express";
import { createEvent, getAllEvents, getStudentEvents } from "../controllers/event.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { hodOnly } from "../middlewares/role.middleware.js";
import { eventUpload } from "../middlewares/eventUpload.js";
const router = express.Router();

router.post("/", protect,eventUpload.single("banner"),hodOnly, createEvent);
router.get("/",protect,getAllEvents);
router.get("/student/my", protect, getStudentEvents);
export default router;
