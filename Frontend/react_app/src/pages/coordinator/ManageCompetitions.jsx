// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getEventCompetitions,
//   publishCompetition,
//   unpublishCompetition,
//   deleteCompetition // ✅ ADD THIS
// } from "../../api/competition.api";
// import toast from "react-hot-toast";

// const ManageCompetitions = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();

//   const [competitions, setCompetitions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCompetitions = async () => {
//     try {
//       setLoading(true);
//       const res = await getEventCompetitions(eventId);
//       setCompetitions(res.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load competitions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompetitions();
//   }, [eventId]);

//   const handlePublish = async (id) => {
//     try {
//       await publishCompetition(id);
//       toast.success("Competition published successfully");
//       await fetchCompetitions();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to publish");
//     }
//   };

//   const handleUnpublish = async (id) => {
//     try {
//       await unpublishCompetition(id);
//       toast.success("Competition unpublished successfully");
//       await fetchCompetitions();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to unpublish");
//     }
//   };

//   // ================= DELETE HANDLER =================

//   const handleDelete = async (id) => {

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this competition? This action cannot be undone."
//     );

//     if (!confirmDelete) return;

//     try {

//       await deleteCompetition(id);
//       toast.success("Competition deleted successfully");
//       await fetchCompetitions();

//     } catch (error) {

//       toast.error(error.response?.data?.message || "Failed to delete competition");
//       console.error(error);

//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading competitions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">

//       {/* ================= HEADER ================= */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Event Competitions</h1>
//           <p className="text-gray-600 mt-1">Manage competitions for this event</p>
//         </div>
//         <button
//           onClick={() =>
//             navigate(`/coordinator/events/${eventId}/competitions/create`)
//           }
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
//         >
//           ➕ Create Competition
//         </button>
//       </div>

//       {/* ================= EMPTY STATE ================= */}
//       {competitions.length === 0 && (
//         <div className="bg-white rounded-lg shadow-md p-12 text-center">
//           <div className="text-6xl mb-4">🏆</div>
//           <p className="text-gray-500 text-lg mb-2">
//             No competitions created yet
//           </p>
//           <p className="text-gray-400 text-sm mb-4">
//             Start by creating your first competition
//           </p>
//           <button
//             onClick={() =>
//               navigate(`/coordinator/events/${eventId}/competitions/create`)
//             }
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
//           >
//             Create Competition
//           </button>
//         </div>
//       )}

//       {/* ================= COMPETITIONS GRID ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {competitions.map(comp => (
//           <div
//             key={comp._id}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <h2 className="font-semibold text-lg text-gray-900 mb-1">
//                   {comp.name}
//                 </h2>
//                 <p className="text-sm text-gray-600 capitalize">
//                   Type: {comp.type}
//                 </p>
//               </div>
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   comp.isPublished
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {comp.isPublished ? "✅ Published" : "📝 Draft"}
//               </span>
//             </div>

//             <div className="text-sm text-gray-600 space-y-1 mb-4">
//               <p>📍 {comp.venue}</p>
//               <p>📅 {new Date(comp.startTime).toLocaleDateString()}</p>
//             </div>

//             {/* ================= ACTION BUTTONS ================= */}
//             <div className="flex flex-wrap gap-2">

//               <button
//                 onClick={() =>
//                   navigate(`/coordinator/competitions/${comp._id}/assign-teachers`)
//                 }
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 👥 Assign
//               </button>

//               <button
//                 onClick={() =>
//                   navigate(`/coordinator/competitions/edit/${comp._id}`)
//                 }
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 ✏️ Edit
//               </button>

//               <button
//                 onClick={() =>
//                   navigate(`/coordinator/competitions/details/${comp._id}`)
//                 }
//                 className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 👁️ View
//               </button>

//               {/* DELETE BUTTON */}
//               <button
//                 onClick={() => handleDelete(comp._id)}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 🗑️ Delete
//               </button>

//               {/* PUBLISH / UNPUBLISH */}
//               {comp.isPublished ? (
//                 <button
//                   onClick={() => handleUnpublish(comp._id)}
//                   className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//                 >
//                   👁️ Unpublish
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handlePublish(comp._id)}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
//                 >
//                   📢 Publish
//                 </button>
//               )}

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageCompetitions;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventCompetitions,
  publishCompetition,
  unpublishCompetition,
  deleteCompetition
} from "../../api/competition.api";
import toast from "react-hot-toast";

const ManageCompetitions = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================

  const fetchCompetitions = async () => {
    try {

      setLoading(true);
      const res = await getEventCompetitions(eventId);
      setCompetitions(res.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load competitions");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, [eventId]);

  // ================= STATUS LOGIC =================

  const getStatus = (startTime, endTime) => {

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= ACTION HANDLERS =================

  const handlePublish = async (id) => {
    try {

      await publishCompetition(id);
      toast.success("Competition published successfully");
      fetchCompetitions();

    } catch (error) {

      toast.error(error.response?.data?.message || "Publish failed");

    }
  };

  const handleUnpublish = async (id) => {
    try {

      await unpublishCompetition(id);
      toast.success("Competition unpublished successfully");
      fetchCompetitions();

    } catch (error) {

      toast.error(error.response?.data?.message || "Unpublish failed");

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this competition?"
    );

    if (!confirmDelete) return;

    try {

      await deleteCompetition(id);
      toast.success("Competition deleted successfully");
      fetchCompetitions();

    } catch (error) {

      toast.error("Delete failed");

    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading competitions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Event Competitions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage competitions for this event
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/coordinator/events/${eventId}/competitions/create`)
          }
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          ➕ Create Competition
        </button>

      </div>

      {/* EMPTY STATE */}

      {competitions.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-12 text-center">

          <p className="text-gray-500">
            No competitions created yet
          </p>

        </div>

      )}

      {/* COMPETITIONS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {competitions.map((comp) => {

          const status = getStatus(comp.startTime, comp.endTime);

          const isLocked = status !== "UPCOMING";

          return (

            <div
              key={comp._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border"
            >

              {/* TITLE + STATUS */}

              <div className="flex justify-between items-start mb-3">

                <h2 className="font-semibold text-lg">
                  {comp.name}
                </h2>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    status === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </span>

              </div>

              {/* META */}

              <div className="text-sm text-gray-600 space-y-1 mb-4">

                <p>📍 {comp.venue}</p>

                <p>
                  🕒 {new Date(comp.startTime).toLocaleString()}
                </p>

              </div>

              {/* ACTION BUTTONS */}

              <div className="flex flex-wrap gap-2">

                {/* ASSIGN TEACHER */}

                <button
                  disabled={isLocked}
                  onClick={() =>
                    navigate(`/coordinator/competitions/${comp._id}/assign-teachers`)
                  }
                  className={`flex-1 px-3 py-2 rounded text-sm ${
                    isLocked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  👥 Assign
                </button>

                {/* EDIT */}

                <button
                  disabled={isLocked}
                  onClick={() =>
                    navigate(`/coordinator/competitions/edit/${comp._id}`)
                  }
                  className={`px-3 py-2 rounded text-sm ${
                    isLocked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  ✏️ Edit
                </button>

                {/* VIEW */}

                <button
                  onClick={() =>
                    navigate(`/coordinator/competitions/details/${comp._id}`)
                  }
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm"
                >
                  👁️ View
                </button>

                {/* DELETE */}

                <button
                  disabled={isLocked}
                  onClick={() => handleDelete(comp._id)}
                  className={`w-full px-3 py-2 rounded text-sm ${
                    isLocked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  🗑️ Delete
                </button>

                {/* PUBLISH / UNPUBLISH */}

                {comp.isPublished ? (

                  <button
                    disabled={isLocked}
                    onClick={() => handleUnpublish(comp._id)}
                    className={`w-full px-3 py-2 rounded text-sm ${
                      isLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    👁️ Unpublish
                  </button>

                ) : (

                  <button
                    onClick={() => handlePublish(comp._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    📢 Publish
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

export default ManageCompetitions;
