import User from "../models/User.js";

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
