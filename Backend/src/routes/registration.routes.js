import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  cancelRegistration,
  deleteRegistration,
  getMyRegistrations,
  registerIndividual,
  registerTeam,
} from "../controllers/registration.controller.js";

const router = express.Router();

// Student registers for individual competition
router.post("/individual", protect, registerIndividual);

router.get("/my",protect,getMyRegistrations);
// Team leader registers team
router.post("/team", protect, registerTeam);

router.patch("/:id/cancel", protect, cancelRegistration);
router.delete("/:id/delete",protect,deleteRegistration);
export default router;

