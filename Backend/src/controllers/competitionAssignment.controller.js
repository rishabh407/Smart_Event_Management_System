import Competition from "../models/Competition.js";
import User from "../models/User.js";

export const assignTeacher = async (req, res) => {

 try {

  const { competitionId, teacherId, role } = req.body;

  if (!competitionId || !teacherId || !role) {
   return res.status(400).json({
    message: "Missing fields"
   });
  }

  const competition = await Competition.findById(competitionId);

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

  const teacher = await User.findById(teacherId);

  if (!teacher || teacher.role !== "TEACHER") {
   return res.status(400).json({
    message: "Invalid teacher"
   });
  }

  // Prevent duplicate
  const alreadyAssigned =
    competition.assignedTeachers.some(
      t => t.teacher.toString() === teacherId
    );

  if (alreadyAssigned) {
   return res.status(400).json({
    message: "Teacher already assigned"
   });
  }

  competition.assignedTeachers.push({
   teacher: teacherId,
   role
  });

  await competition.save();

  res.status(200).json({
   message: "Teacher assigned successfully",
   competition
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};



export const removeTeacher = async (req, res) => {

 try {

  const { competitionId, teacherId } = req.body;
  console.log(competitionId,teacherId);
  const competition = await Competition.findById(competitionId).populate("assignedTeachers.teacher", "fullName email");

  if (!competition) {
   return res.status(404).json({
    message: "Competition not found"
   });
  }

competition.assignedTeachers =
 competition.assignedTeachers.filter(
  t => t.teacher._id.toString() !== teacherId
 );


  await competition.save();

  res.status(200).json({
   message: "Teacher removed successfully"
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};

