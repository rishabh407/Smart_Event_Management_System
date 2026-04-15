
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
  getDepartmentCoordinators,
  getEventCompetitions
} from "../controllers/event.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly, hodOnly } from "../middlewares/role.middleware.js";
import { eventUpload } from "../middlewares/eventUpload.js";

const router = express.Router();


router.post(
  "/",
  protect,
  hodOnly,
  eventUpload.single("banner"),
  createEvent
);


router.get("/", protect, getAllEvents);


router.get("/student/my", protect, getStudentEvents);




router.get("/hod/my", protect, hodOnly, getMyEvents);


router.put(
  "/:id/update",
  protect,
  hodOnly,
  eventUpload.single("banner"),
  updateEvent
);


router.patch("/:id/publish", protect, hodOnly, publishEvent);
router.patch("/:id/unpublish", protect, hodOnly, unpublishEvent);
router.get("/:eventId/competitions", protect, hodOnly, getEventCompetitions);

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



router.get(
  "/hod/coordinators",
  protect,
  hodOnly,
  getDepartmentCoordinators
);
export default router;

