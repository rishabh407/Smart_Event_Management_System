import { exportAttendance, exportParticipants, exportResults } from "../controllers/export.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { teacherOnly } from "../middlewares/role.middleware.js";
import express from "express";
const router = express.Router();
router.get(
 "/attendance/:competitionId",
 protect,
 teacherOnly,
 exportAttendance
);

router.get(
 "/results/:competitionId",
 protect,
 teacherOnly,
 exportResults
);

router.get(
 "/participants/:competitionId",
 protect,
 teacherOnly,
 exportParticipants
);
export default router;