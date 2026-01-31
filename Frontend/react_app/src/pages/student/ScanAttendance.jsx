// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { markattendance } from "../../api/attendance.api";

// const ScanAttendance = () => {

//   const { id } = useParams();

//   const [status, setStatus] = useState("loading");

//   const markAttendance = async () => {
//     try {
//       const res = await markattendance(id);
//       setStatus("success");
//     } catch (error) {

//       console.log(error);

//       setStatus("error");
//     }
//   };
//   useEffect(() => {
//     markAttendance();
//   }, [id]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">

//       <div className="bg-white p-6 rounded shadow text-center w-80">

//         {status === "loading" && (
//           <p className="text-gray-600">
//             Marking attendance...
//           </p>
//         )}

//         {status === "success" && (
//           <p className="text-green-600 font-bold">
//             ✅ Attendance Marked Successfully
//           </p>
//         )}

//         {status === "error" && (
//           <p className="text-red-600 font-bold">
//             ❌ Attendance Failed or Already Marked
//           </p>
//         )}

//       </div>

//     </div>
//   );
// };

// export default ScanAttendance;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { markAttendanceByQR } from "../../api/registeration.api";
import toast from "react-hot-toast";

const ScanAttendance = () => {

  const { competitionId } = useParams();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const markAttendance = async () => {

    try {
      setLoading(true);

      await markAttendanceByQR(competitionId);

      toast.success("Attendance marked successfully ✅");

      setDone(true);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Attendance failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded shadow text-center">

        <h2 className="text-xl font-bold mb-3">
          Competition Attendance
        </h2>

        {done ? (

          <p className="text-green-600 font-medium">
            ✅ Attendance Recorded Successfully
          </p>

        ) : (

          <button
            onClick={markAttendance}
            disabled={loading}
            className={`px-6 py-3 rounded text-white font-medium ${
              loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>

        )}

      </div>

    </div>
  );
};

export default ScanAttendance;
