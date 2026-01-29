import Competition from "../models/Competition.js";
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

export const getCoordinatorEvents = async (req, res) => {

 try {

  const events = await Event.find({
   coordinator: req.user._id,
   isDeleted: false,
   isPublished: true
  }).sort({ startDate: 1 });

  res.status(200).json(events);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};