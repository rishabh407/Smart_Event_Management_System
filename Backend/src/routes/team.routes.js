import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  deleteTeam,
  getMyTeams,
  getTeamsByUser,
} from "../controllers/team.controller.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.delete("/delete", protect, deleteTeam);
router.get("/my/:competitionId", protect, getMyTeams);
router.get("/teambyuser",protect,getTeamsByUser);
export default router; 
