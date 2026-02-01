// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   cancelRegistration,
//   deleteRegistration,
//   getMyRegistrations
// } from "../../api/registeration.api";
// import toast from "react-hot-toast";

// const MyRegistrations = () => {

//   const navigate = useNavigate();

//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [cancelLoadingId, setCancelLoadingId] = useState(null);
//   const [deleteLoadingId, setDeleteLoadingId] = useState(null);

//   // ================= FETCH DATA =================

//   const fetchRegistrations = async () => {
//     try {

//       setLoading(true);

//       const res = await getMyRegistrations();
//       setRegistrations(res.data.data);

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to load registrations");

//     } finally {

//       setLoading(false);

//     }
//   };

//   useEffect(() => {
//     fetchRegistrations();
//   }, []);

//   // ================= CANCEL REGISTRATION =================

//   const handleCancel = async (registrationId) => {

//     const confirmCancel = window.confirm(
//       "Are you sure you want to cancel this registration?"
//     );

//     if (!confirmCancel) return;

//     try {

//       setCancelLoadingId(registrationId);

//       await cancelRegistration(registrationId);

//       toast.success("Registration cancelled successfully");

//       setRegistrations((prev) =>
//         prev.map((reg) =>
//           reg._id === registrationId
//             ? { ...reg, status: "cancelled" }
//             : reg
//         )
//       );

//     } catch (error) {

//       toast.error(error.response?.data?.message || "Cancel failed");

//     } finally {

//       setCancelLoadingId(null);

//     }
//   };

//   // ================= DELETE REGISTRATION =================

//   const handleDelete = async (registrationId) => {

//     const confirmDelete = window.confirm(
//       "This will permanently delete this record. Continue?"
//     );

//     if (!confirmDelete) return;

//     try {

//       setDeleteLoadingId(registrationId);

//       await deleteRegistration(registrationId);

//       toast.success("Registration deleted successfully");

//       setRegistrations((prev) =>
//         prev.filter((reg) => reg._id !== registrationId)
//       );

//     } catch (error) {

//       toast.error(error.response?.data?.message || "Delete failed");

//     } finally {

//       setDeleteLoadingId(null);

//     }
//   };

//   // ================= LOADING UI =================

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading registrations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">

//       {/* ================= HEADER ================= */}

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">
//           My Registrations
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Manage your competition registrations
//         </p>
//       </div>

//       {/* ================= EMPTY STATE ================= */}

//       {registrations.length === 0 && (

//         <div className="bg-white rounded-lg shadow-md p-12 text-center">

//           <div className="text-6xl mb-4">📋</div>

//           <p className="text-gray-500 text-lg mb-2">
//             No registrations yet
//           </p>

//           <p className="text-gray-400 text-sm mb-4">
//             Start by browsing events and registering for competitions.
//           </p>

//           <button
//             onClick={() => navigate("/student/events")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
//           >
//             Browse Events
//           </button>

//         </div>

//       )}

//       {/* ================= REGISTRATION CARDS ================= */}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {registrations.map((reg) => (

//           <div
//             key={reg._id}
//             className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
//           >

//             {/* DELETE BUTTON (ONLY FOR CANCELLED) */}

//             {reg.status === "cancelled" && (

//               <button
//                 onClick={() => handleDelete(reg._id)}
//                 disabled={deleteLoadingId === reg._id}
//                 title="Delete Registration"
//                 className={`absolute top-3 right-3 text-gray-500 hover:text-red-600 transition ${
//                   deleteLoadingId === reg._id &&
//                   "opacity-50 cursor-not-allowed"
//                 }`}
//               >
//                 🗑️
//               </button>

//             )}

//             {/* COMPETITION NAME */}

//             <h2 className="font-semibold text-lg mb-2 pr-8">
//               {reg.competition?.name || "Competition"}
//             </h2>

//             {/* DETAILS */}

//             <div className="text-sm text-gray-600 space-y-1 mb-4">

//               <p>
//                 <strong>Venue:</strong> {reg.competition?.venue}
//               </p>

//               {reg.team && (
//                 <p>
//                   <strong>Team:</strong> {reg.team.teamName}
//                 </p>
//               )}

//               <p>
//                 <strong>Registered:</strong>{" "}
//                 {new Date(reg.createdAt).toLocaleDateString()}
//               </p>

//             </div>

//             {/* STATUS BADGE */}

//             <div className="mb-4">

//               <span
//                 className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                   reg.status === "registered"
//                     ? "bg-green-100 text-green-700"
//                     : reg.status === "attended"
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >

//                 {reg.status === "registered" && "✅ Registered"}
//                 {reg.status === "attended" && "✓ Attended"}
//                 {reg.status === "cancelled" && "❌ Cancelled"}

//               </span>

//             </div>

//             {/* ACTION BUTTONS */}

//             <div className="space-y-2">

//               {/* SCAN ATTENDANCE */}

//               {reg.status === "registered" && (

//                 <button
//                   onClick={() =>
//                     navigate("/student/scan")
//                   }
//                   className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
//                 >
//                   📷 Scan Attendance QR
//                 </button>

//               )}

//               {/* CANCEL REGISTRATION */}

//               {reg.status === "registered" && (

//                 <button
//                   onClick={() => handleCancel(reg._id)}
//                   disabled={cancelLoadingId === reg._id}
//                   className={`w-full py-2 px-4 rounded-lg font-medium transition ${
//                     cancelLoadingId === reg._id
//                       ? "bg-gray-400 cursor-not-allowed text-white"
//                       : "bg-red-500 hover:bg-red-600 text-white"
//                   }`}
//                 >
//                   {cancelLoadingId === reg._id
//                     ? "Cancelling..."
//                     : "Cancel Registration"}
//                 </button>

//               )}

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default MyRegistrations;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelRegistration,
  deleteRegistration,
  getMyRegistrations
} from "../../api/registeration.api";
import toast from "react-hot-toast";

const MyRegistrations = () => {

  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ================= TIME STATUS CHECK =================

  const getCompetitionStatus = (startTime, endTime) => {

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= FETCH DATA =================

  const fetchRegistrations = async () => {
    try {

      setLoading(true);

      const res = await getMyRegistrations();
      setRegistrations(res.data.data);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load registrations");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // ================= CANCEL REGISTRATION =================

  const handleCancel = async (registrationId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {

      setCancelLoadingId(registrationId);

      await cancelRegistration(registrationId);

      toast.success("Registration cancelled successfully");

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId
            ? { ...reg, status: "cancelled" }
            : reg
        )
      );

    } catch (error) {

      toast.error(error.response?.data?.message || "Cancel failed");

    } finally {

      setCancelLoadingId(null);

    }
  };

  // ================= DELETE REGISTRATION =================

  const handleDelete = async (registrationId) => {

    const confirmDelete = window.confirm(
      "This will permanently delete this record. Continue?"
    );

    if (!confirmDelete) return;

    try {

      setDeleteLoadingId(registrationId);

      await deleteRegistration(registrationId);

      toast.success("Registration deleted successfully");

      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId)
      );

    } catch (error) {

      toast.error(error.response?.data?.message || "Delete failed");

    } finally {

      setDeleteLoadingId(null);

    }
  };

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Registrations
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your competition registrations
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {registrations.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-12 text-center">

          <div className="text-6xl mb-4">📋</div>

          <p className="text-gray-500 text-lg mb-2">
            No registrations yet
          </p>

          <p className="text-gray-400 text-sm mb-4">
            Start by browsing events and registering for competitions.
          </p>

          <button
            onClick={() => navigate("/student/events")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Events
          </button>

        </div>

      )}

      {/* ================= REGISTRATION CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {registrations.map((reg) => {

          const competitionStatus = getCompetitionStatus(
            reg.competition?.startTime,
            reg.competition?.endTime
          );

          const canScan =
            reg.status === "registered" &&
            competitionStatus === "ONGOING";

          return (

            <div
              key={reg._id}
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >

              {/* DELETE BUTTON */}

              {reg.status === "cancelled" && (

                <button
                  onClick={() => handleDelete(reg._id)}
                  disabled={deleteLoadingId === reg._id}
                  title="Delete Registration"
                  className={`absolute top-3 right-3 text-gray-500 hover:text-red-600 transition ${
                    deleteLoadingId === reg._id &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  🗑️
                </button>

              )}

              {/* COMPETITION NAME */}

              <h2 className="font-semibold text-lg mb-2 pr-8">
                {reg.competition?.name || "Competition"}
              </h2>

              {/* DETAILS */}

              <div className="text-sm text-gray-600 space-y-1 mb-4">

                <p>
                  <strong>Venue:</strong> {reg.competition?.venue}
                </p>

                {reg.team && (
                  <p>
                    <strong>Team:</strong> {reg.team.teamName}
                  </p>
                )}

                <p>
                  <strong>Registered:</strong>{" "}
                  {new Date(reg.createdAt).toLocaleDateString()}
                </p>

              </div>

              {/* STATUS BADGE */}

              <div className="mb-4">

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === "registered"
                      ? "bg-green-100 text-green-700"
                      : reg.status === "attended"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {reg.status === "registered" && "✅ Registered"}
                  {reg.status === "attended" && "✓ Attended"}
                  {reg.status === "cancelled" && "❌ Cancelled"}

                </span>

              </div>

              {/* ACTION BUTTONS */}

              <div className="space-y-2">

                {/* ATTENDANCE BUTTON */}

                {reg.status === "attended" ? (

                  <div className="text-center py-2 text-green-700 font-medium">
                    ✅ Attendance Marked
                  </div>

                ) : (

                  reg.status === "registered" && (

                    <button
                      disabled={!canScan}
                      onClick={() => navigate("/student/scan")}
                      className={`w-full py-2 rounded-lg font-medium transition
                        ${
                          canScan
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }
                      `}
                    >

                      {competitionStatus === "UPCOMING" &&
                        "⏳ Attendance Not Started"}

                      {competitionStatus === "ONGOING" &&
                        "📷 Scan Attendance QR"}

                      {competitionStatus === "COMPLETED" &&
                        "❌ Attendance Closed"}

                    </button>

                  )

                )}

                {/* CANCEL BUTTON */}

                {reg.status === "registered" && (

                  <button
                    onClick={() => handleCancel(reg._id)}
                    disabled={cancelLoadingId === reg._id}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                      cancelLoadingId === reg._id
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >

                    {cancelLoadingId === reg._id
                      ? "Cancelling..."
                      : "Cancel Registration"}

                  </button>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default MyRegistrations;
