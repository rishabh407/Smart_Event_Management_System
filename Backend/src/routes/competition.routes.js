import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createCompetition,
 deleteCompetition,
 getCompetitionById,
 getCompetitionDetails,
 getCompetitionsByEvent,
 getCoordinatorDashboardStats,
 getPublicCompetitionsByEvent,
 publishCompetition,
 toggleRegistrationStatus,
 unpublishCompetition,
 updateCompetition
} from "../controllers/competition.controller.js";
import { coordinatorOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, createCompetition);

// GET single competition (for edit page)
router.get(
 "/:id",
 protect,
 getCompetitionById
);


// UPDATE competition
router.put(
 "/:id",
 protect,
 coordinatorOnly,
 updateCompetition
);


router.get(
 "/event/:eventId",
 protect,
 getCompetitionsByEvent
);

router.patch(
 "/:id/publish",
 protect,
 coordinatorOnly,
 publishCompetition
);

router.patch(
 "/:id/unpublish",
 protect,
 coordinatorOnly,
 unpublishCompetition
);

router.get(
 "/:id/details",
 protect,
 coordinatorOnly,
 getCompetitionDetails
);

router.get(
 "/coordinator/dashboard-stats",
 protect,
 coordinatorOnly,
 getCoordinatorDashboardStats
);

router.get("/events/:eventId",protect,getPublicCompetitionsByEvent);

router.patch(
 "/:id/toggle-registration",
 protect,
 coordinatorOnly,
 toggleRegistrationStatus
);

router.delete("/delete/:id", deleteCompetition);

export default router;
