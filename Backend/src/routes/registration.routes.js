import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  cancelRegistration,
  deleteRegistration,
  getCompetitionRegistrationStats,
  getMyRegistrations,
  getRegistrationsByCompetition,
  registerIndividual,
  registerTeam,
} from "../controllers/registration.controller.js";
import { coordinatorOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student registers for individual competition
router.post("/individual", protect, registerIndividual);

router.get("/my",protect,getMyRegistrations);
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


export default router;

