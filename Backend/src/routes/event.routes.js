
import express from "express";
import {
  createEvent,
  getAllEvents,
  getStudentEvents,
  getMyEvents,
  updateEvent,
  publishEvent,
  unpublishEvent,
  deleteEvent,
  restoreEvent,
  getEventById,
  getHodDashboardStats,
  getEventPerformanceRanking,
  getCoordinatorEvents,
  getDepartmentCoordinators
} from "../controllers/event.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly, hodOnly } from "../middlewares/role.middleware.js";
import { eventUpload } from "../middlewares/eventUpload.js";

const router = express.Router();

// CREATE EVENT
router.post(
  "/",
  protect,
  hodOnly,
  eventUpload.single("banner"),
  createEvent
);

// PUBLIC EVENTS
router.get("/", protect, getAllEvents);

// STUDENT EVENTS
router.get("/student/my", protect, getStudentEvents);

// ================= HOD MANAGEMENT =================

// HOD OWN EVENTS
router.get("/hod/my", protect, hodOnly, getMyEvents);

// UPDATE EVENT
router.put(
  "/:id/update",
  protect,
  hodOnly,
  eventUpload.single("banner"),
  updateEvent
);

// PUBLISH / UNPUBLISH
router.patch("/:id/publish", protect, hodOnly, publishEvent);
router.patch("/:id/unpublish", protect, hodOnly, unpublishEvent);

// DELETE / RESTORE
router.patch("/:id/delete", protect, hodOnly, deleteEvent);
router.patch("/:id/restore", protect, hodOnly, restoreEvent);
router.get("/:id", protect, getEventById);
router.get("/hod/dashboard-stats",protect,hodOnly,getHodDashboardStats);
router.get(
  "/hod/performance-ranking",
  protect,
  hodOnly,
  getEventPerformanceRanking
);

router.get(
 "/coordinator/my",
 protect,
 coordinatorOnly,
 getCoordinatorEvents
);

// GET DEPARTMENT COORDINATORS (HOD only)

router.get(
  "/hod/coordinators",
  protect,
  hodOnly,
  getDepartmentCoordinators
);

export default router;

