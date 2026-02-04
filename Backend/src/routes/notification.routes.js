import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMyNotifications, clearMyNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

// Get runtime notifications for logged-in user
router.get("/my", protect, getMyNotifications);

// Clear all notifications for logged-in user (persistent)
router.post("/clear", protect, clearMyNotifications);

export default router;

