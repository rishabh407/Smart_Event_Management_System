import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  cancelRegistration,
  deleteRegistration,
  getCompetitionRegistrations,
  getCompetitionRegistrationStats,
  getMyRegistrations,
  getRegistrationsByCompetition,
  registerIndividual,
  registerTeam,
  getStudentDashboardStats,
} from "../controllers/registration.controller.js";
import { coordinatorOnly, studentOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student registers for individual competition
router.post("/individual", protect, registerIndividual);

router.get("/my",protect,getMyRegistrations);
router.get("/student/dashboard-stats", protect, studentOnly, getStudentDashboardStats);
// Team leader registers team
router.post("/team", protect, registerTeam);

router.patch("/:id/cancel", protect, cancelRegistration);
router.delete("/:id/delete",protect,deleteRegistration);

router.get(
 "/competition/:competitionId",
 protect,
 getRegistrationsByCompetition
);

router.get(
 "/competition/:id/stats",
 protect,
 coordinatorOnly,
 getCompetitionRegistrationStats
);

router.get(
 "/competition/:id",
 protect,
 coordinatorOnly,
 getCompetitionRegistrations
);

export default router;

