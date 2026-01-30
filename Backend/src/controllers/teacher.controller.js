import Competition from "../models/Competition.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Certificate from "../models/Certificate.js";

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

export const getassigncompetition=async(req,res)=>{
    try{
        const competitions = await Competition.find({
  "assignedTeachers.teacher": req.user._id,
  isDeleted: false,
  isPublished: true
})
.populate("assignedTeachers.teacher", "name email")
.sort({ startDate: 1 }); 
res.status(200).json(competitions);
    }catch(error)
    {
  console.error(error);

  res.status(500).json({
   message: "Server error"
  });
    }
}

export const getTeacherDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get competitions assigned to this teacher
    const competitions = await Competition.find({
      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true
    }).select("_id");

    const competitionIds = competitions.map(c => c._id);

    // Total registrations
    const totalRegistrations = await Registration.countDocuments({
      competition: { $in: competitionIds }
    });

    // Attended registrations
    const attendedRegistrations = await Registration.countDocuments({
      competition: { $in: competitionIds },
      status: "attended"
    });

    // Total attendance marked
    const totalAttendance = await Attendance.countDocuments({
      competition: { $in: competitionIds },
      teacher: req.user._id
    });

    // Results declared
    const resultsDeclared = await Result.countDocuments({
      competition: { $in: competitionIds }
    });

    // Certificates generated
    const certificatesGenerated = await Certificate.countDocuments({
      competition: { $in: competitionIds }
    });

    // Upcoming competitions
    const now = new Date();
    const upcomingCompetitions = await Competition.countDocuments({
      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true,
      startTime: { $gt: now }
    });

    // Ongoing competitions
    const ongoingCompetitions = await Competition.countDocuments({
      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    // Completed competitions
    const completedCompetitions = await Competition.countDocuments({
      "assignedTeachers.teacher": req.user._id,
      isDeleted: false,
      isPublished: true,
      endTime: { $lt: now }
    });

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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};