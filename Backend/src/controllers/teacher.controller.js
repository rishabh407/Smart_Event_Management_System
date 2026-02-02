import Competition from "../models/Competition.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Certificate from "../models/Certificate.js";
import mongoose from "mongoose";

export const getDepartmentTeachers = async (req, res) => {

 try {

  const teachers = await User.find({
   role: "TEACHER",
   departmentId: req.user.departmentId
  }).select("fullName email");

  res.status(200).json(teachers);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

export const getAllAssignedCompetitions = async (req, res) => {

  try {

    const competitions = await Competition.find({

      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true

    })
    .sort({ startTime: 1 })
    .lean();

    res.status(200).json(competitions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


export const getassigncompetition = async (req, res) => {

  try {

    const { id } = req.params; // eventId

    const competitions = await Competition.find({

      eventId: id,

      "assignedTeachers.teacher": req.user._id,

      isDeleted: false,
      isPublished: true

    })
    .populate("assignedTeachers.teacher", "fullName email")
    .sort({ startTime: 1 })
    .lean(); // ✅ IMPORTANT

    // ================= ADD REGISTRATION COUNT =================

    for (let comp of competitions) {

      const total = await Registration.countDocuments({
        competition: comp._id,
        status: { $ne: "cancelled" }
      });

      comp.totalRegistrations = total;

    }

    res.status(200).json(competitions);

  } catch (error) {

    console.error("Assigned Competition Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const getTeacherDashboardStats = async (req, res) => {
  try {

    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ================= FETCH ASSIGNED COMPETITIONS =================

    const competitions = await Competition.find({
      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true
    }).select("_id startTime endTime");

    const competitionIds = competitions.map(c => c._id);

    const now = new Date();

    // ================= REGISTRATION COUNTS =================

    const totalRegistrations = await Registration.countDocuments({
      competition: { $in: competitionIds }
    });

    const attendedRegistrations = await Registration.countDocuments({
      competition: { $in: competitionIds },
      status: "attended"
    });

    // Attendance is SAME as attended registrations
    const totalAttendance = attendedRegistrations;

    // ================= RESULT & CERTIFICATE =================

    const resultsDeclared = await Result.countDocuments({
      competition: { $in: competitionIds }
    });

    const certificatesGenerated = await Certificate.countDocuments({
      competition: { $in: competitionIds }
    });

    // ================= COMPETITION STATUS =================

    const upcomingCompetitions = competitions.filter(
      c => new Date(c.startTime) > now
    ).length;

    const ongoingCompetitions = competitions.filter(
      c =>
        new Date(c.startTime) <= now &&
        new Date(c.endTime) >= now
    ).length;

    const completedCompetitions = competitions.filter(
      c => new Date(c.endTime) < now
    ).length;

    // ================= RESPONSE =================

    res.status(200).json({
      totalCompetitions: competitions.length,
      upcomingCompetitions,
      ongoingCompetitions,
      completedCompetitions,

      totalRegistrations,
      attendedRegistrations,
      totalAttendance,

      resultsDeclared,
      certificatesGenerated
    });

  } catch (error) {

    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};
