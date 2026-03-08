import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import {
 exportAttendance,
 exportParticipants,
 exportResults
} from "../../api/export.api";

const ExportReports = () => {

 const [competitions, setCompetitions] = useState([]);
 const [selectedCompetition, setSelectedCompetition] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchCompetitions();
 }, []);

 /* ===============================
    FETCH ASSIGNED COMPETITIONS
 =============================== */

 const fetchCompetitions = async () => {

  try {

   const res = await getAllAssignedCompetitions();

   console.log("Competitions:", res.data);

   setCompetitions(res.data || []);

  } catch (error) {

   console.error(error);
   toast.error("Failed to load competitions");

  } finally {

   setLoading(false);

  }

 };

 /* ===============================
    DOWNLOAD FILE FUNCTION
 =============================== */

 const downloadFile = (data, filename) => {

  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();

  /* cleanup */

  link.remove();
  window.URL.revokeObjectURL(url);

 };

 /* ===============================
    EXPORT ATTENDANCE
 =============================== */

 const handleExportAttendance = async () => {

  if (!selectedCompetition)
   return toast.error("Select competition");

  try {

   const res = await exportAttendance(selectedCompetition);

   downloadFile(res.data, "attendance.csv");

   toast.success("Attendance exported");

  } catch (error) {

   console.error(error);
   toast.error("Export failed");

  }

 };

 /* ===============================
    EXPORT RESULTS
 =============================== */

 const handleExportResults = async () => {

  if (!selectedCompetition)
   return toast.error("Select competition");

  try {

   const res = await exportResults(selectedCompetition);

   downloadFile(res.data, "results.csv");

   toast.success("Results exported");

  } catch (error) {

   console.error(error);
   toast.error("Export failed");

  }

 };

 /* ===============================
    EXPORT PARTICIPANTS
 =============================== */

 const handleExportParticipants = async () => {

  if (!selectedCompetition)
   return toast.error("Select competition");

  try {

   const res = await exportParticipants(selectedCompetition);

   downloadFile(res.data, "participants.csv");

   toast.success("Participants exported");

  } catch (error) {

   console.error(error);
   toast.error("Export failed");

  }

 };

 if (loading) return <p className="p-6">Loading competitions...</p>;

 return (

  <div className="p-6 space-y-6">

   <h1 className="text-2xl font-bold">
    Export Reports
   </h1>

   <div className="bg-white shadow rounded p-6 space-y-5">

    {/* ===============================
        SELECT COMPETITION
    =============================== */}

    <div>

     <label className="block text-sm font-medium mb-2">
      Select Competition
     </label>

     <select
      value={selectedCompetition}
      onChange={(e) => setSelectedCompetition(e.target.value)}
      className="w-full border rounded px-3 py-2"
     >

      <option value="">
       -- Select Competition --
      </option>

      {competitions.map((comp) => (

       <option key={comp._id} value={comp._id}>

        {comp.eventId?.title
         ? `${comp.eventId.title} → ${comp.name}`
         : comp.name}

       </option>

      ))}

     </select>

    </div>

    {/* ===============================
        EXPORT BUTTONS
    =============================== */}

    <div className="flex flex-wrap gap-3">

     <button
      onClick={handleExportParticipants}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
     >
      Export Participants
     </button>

     <button
      onClick={handleExportAttendance}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
     >
      Export Attendance
     </button>

     <button
      onClick={handleExportResults}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
     >
      Export Results
     </button>

    </div>

   </div>

  </div>

 );

};

export default ExportReports;