// import express from "express";
// import { registerStudent, registerStaff, login, changePassword } from "../controllers/auth.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// router.post("/register-student", registerStudent);
// router.post("/register-staff", protect, registerStaff);
// router.post("/login", login);
// router.post("/change-password", protect, changePassword);

// export default router;

import express from "express";
import { registerStudent, registerStaff, login, changePassword, refreshToken, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register-student", registerStudent);
router.post("/register-staff", protect, registerStaff);
router.post("/login",login);
router.post("/change-password", protect, changePassword);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);
export default router;
