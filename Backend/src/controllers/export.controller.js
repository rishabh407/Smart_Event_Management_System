import Registration from "../models/Registration.js";
import Result from "../models/Result.js";



export const exportAttendance = async (req, res) => {
 try {

  const { competitionId } = req.params;

  const registrations = await Registration.find({
   competition: competitionId,
   status: { $ne: "cancelled" }
  })
  .populate("student", "fullName email course year section")
  .lean();

  if (!registrations.length) {
   return res.status(404).json({
    message: "No attendance found"
   });
  }

  let csv = "Student Name,Email,Class,Status\n";

  registrations.forEach(r => {

   const className =
    `${r.student?.course || ""}-${r.student?.year || ""}-${r.student?.section || ""}`;

   csv += `${r.student?.fullName || ""},${r.student?.email || ""},${className},${r.status}\n`;

  });

  res.header("Content-Type", "text/csv");
  res.attachment("attendance.csv");

  return res.send(csv);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Failed to export attendance"
  });

 }
};





export const exportParticipants = async (req, res) => {

 try {

  const { competitionId } = req.params;

  const registrations = await Registration.find({
   competition: competitionId,
   status: { $ne: "cancelled" }
  })
  .populate("student", "fullName email course year section")
  .lean();

  if (!registrations.length) {
   return res.status(404).json({
    message: "No participants found"
   });
  }

  let csv = "Student Name,Email,Class\n";

  registrations.forEach(r => {

   const className =
    `${r.student?.course || ""}-${r.student?.year || ""}-${r.student?.section || ""}`;

   csv += `${r.student?.fullName || ""},${r.student?.email || ""},${className}\n`;

  });

  res.header("Content-Type", "text/csv");
  res.attachment("participants.csv");

  return res.send(csv);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Failed to export participants"
  });

 }

};





export const exportResults = async (req, res) => {

 try {

  const { competitionId } = req.params;

  const results = await Result.find({
   competition: competitionId
  })
  .populate("student", "fullName email course year section")
  .populate("team", "teamName")
  .lean();

  if (!results.length) {
   return res.status(404).json({
    message: "No results declared"
   });
  }

  let csv = "Position,Winner,Email,Class\n";

  results.forEach(r => {

   const winner =
    r.student?.fullName ||
    r.team?.teamName ||
    "Unknown";

   const className =
    `${r.student?.course || ""}-${r.student?.year || ""}-${r.student?.section || ""}`;

   csv += `${r.position},${winner},${r.student?.email || ""},${className}\n`;

  });

  res.header("Content-Type", "text/csv");
  res.attachment("results.csv");

  return res.send(csv);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Failed to export results"
  });

 }

};