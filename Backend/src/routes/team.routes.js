import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createTeam, deleteTeam, joinTeam, leaveTeam } from "../controllers/team.controller.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.delete("/delete", protect, deleteTeam);

export default router;
