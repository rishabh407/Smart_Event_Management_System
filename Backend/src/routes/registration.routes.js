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
  getStudentDashboardStats,
  getCompetitionRegistrations,
  markAttendanceByQR,
} from "../controllers/registration.controller.js";
import { allowRoles, coordinatorOnly, hodOnly, studentOnly, teacherOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student registers for individual competition
router.post("/individual", protect, registerIndividual);

router.get("/my",protect,getMyRegistrations);
router.get("/student/dashboard-stats", protect, studentOnly, getStudentDashboardStats);
// Team leader registers team
router.post("/team", protect, registerTeam);

router.patch("/:id/cancel", protect, cancelRegistration);
router.delete("/:id/delete",protect,deleteRegistration);

// router.get(
//  "/competition/:competitionId",
//  protect,
//  getRegistrationsByCompetition
// );

router.get(
 "/competition/:id/stats",
 protect,
 coordinatorOnly,
 getCompetitionRegistrationStats
);

router.get(
 "/competition/:id",
 protect,
 allowRoles("TEACHER", "COORDINATOR", "HOD"),
 getCompetitionRegistrations
);

router.post(
 "/attendance",
 protect,
 studentOnly,
 markAttendanceByQR
);


export default router;


// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import {
//   cancelRegistration,
//   deleteRegistration,
//   getCompetitionRegistrationStats,
//   getMyRegistrations,
//   registerIndividual,
//   registerTeam,
//   getStudentDashboardStats,
//   getCompetitionRegistrations,
// } from "../controllers/registration.controller.js";

// import { allowRoles, studentOnly } from "../middlewares/role.middleware.js";

// const router = express.Router();

// // ================= STUDENT =================

// router.post("/individual", protect, registerIndividual);
// router.post("/team", protect, registerTeam);

// router.get("/my", protect, getMyRegistrations);

// router.get(
//  "/student/dashboard-stats",
//  protect,
//  studentOnly,
//  getStudentDashboardStats
// );

// router.patch("/:id/cancel", protect, cancelRegistration);
// router.delete("/:id/delete", protect, deleteRegistration);

// // ================= STAFF =================

// // VIEW REGISTRATIONS
// router.get(
//  "/competition/:id",
//  protect,
//  allowRoles("TEACHER", "COORDINATOR", "HOD"),
//  getCompetitionRegistrations
// );

// // REGISTRATION STATS
// router.get(
//  "/competition/:id/stats",
//  protect,
//  allowRoles("COORDINATOR", "HOD"),
//  getCompetitionRegistrationStats
// );

// export default router;
