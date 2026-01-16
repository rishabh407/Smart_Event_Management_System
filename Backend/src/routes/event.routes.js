import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventsByDepartment,
  getEventById,
} from "../controllers/event.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllEvents);
router.get("/department/:departmentId", getEventsByDepartment);
router.get("/:eventId", getEventById);

// Protected (HOD / Teacher)
router.post("/", protect, teacherOnly, createEvent);

export default router;
