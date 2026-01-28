import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { coordinatorOnly } from "../middlewares/role.middleware.js";

import {
 assignTeacher,
 removeTeacher
} from "../controllers/competitionAssignment.controller.js";

const router = express.Router();

router.post(
 "/assign",
 protect,
 coordinatorOnly,
 assignTeacher
);

router.post(
 "/remove",
 protect,
 coordinatorOnly,
 removeTeacher
);

export default router;
