// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getMyEvents,
//   deleteEvent,
//   publishEvent,
//   unpublishEvent
// } from "../../api/event.api";
// import toast from "react-hot-toast";

// const ManageEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const res = await getMyEvents();
//       setEvents(res.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load events");
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm(
//       "Are you sure you want to delete this event? This action cannot be undone."
//     );

//     if (!confirm) return;

//     try {
//       await toast.promise(
//         deleteEvent(id),
//         {
//           loading: 'Deleting event...',
//           success: 'Event deleted successfully ✅',
//           error: (err) => err.response?.data?.message || 'Delete failed',
//         }
//       );
//       setEvents(prev => prev.filter(event => event._id !== id));
//     } catch (error) {
//       // Error handled by toast.promise
//     }
//   };

//   const handlePublishToggle = async (event) => {
//     try {
//       if (event.isPublished) {
//         await toast.promise(
//           unpublishEvent(event._id),
//           {
//             loading: 'Unpublishing event...',
//             success: 'Event unpublished successfully ✅',
//             error: (err) => err.response?.data?.message || 'Unpublish failed',
//           }
//         );
//       } else {
//         await toast.promise(
//           publishEvent(event._id),
//           {
//             loading: 'Publishing event...',
//             success: 'Event published successfully ✅',
//             error: (err) => err.response?.data?.message || 'Publish failed',
//           }
//         );
//       }

//       setEvents(prev =>
//         prev.map(e =>
//           e._id === event._id
//             ? { ...e, isPublished: !e.isPublished }
//             : e
//         )
//       );
//     } catch (error) {
//       // Error handled by toast.promise
//     }
//   };

//   const getStatusColor = (status) => {
//     if (status === "upcoming") return "bg-orange-100 text-orange-700";
//     if (status === "ongoing") return "bg-green-100 text-green-700";
//     return "bg-gray-100 text-gray-700";
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading events...</p>
//         </div>
//       </div>
//     );
//   }
//   console.log(events);
//   return (
//     <div className="p-6">
//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Events</h1>
//           <p className="text-gray-600">Create, edit, publish, and manage all your events</p>
//         </div>
//         <button
//           onClick={() => navigate("/hod/events/create")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//         >
//           ➕ Create New Event
//         </button>
//       </div>

//       {/* ================= EMPTY STATE ================= */}
//       {events.length === 0 && (
//         <div className="bg-white rounded-lg shadow-md p-12 text-center">
//           <div className="text-6xl mb-4">📅</div>
//           <p className="text-gray-500 text-lg mb-2">No events created yet</p>
//           <p className="text-gray-400 text-sm mb-4">
//             Start by creating your first event
//           </p>
//           <button
//             onClick={() => navigate("/hod/events/create")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
//           >
//             Create Event
//           </button>
//         </div>
//       )}

//       {/* ================= EVENTS GRID ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(event => (
//           <div
//             key={event._id}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
//           >
//             {/* Banner Image */}
//             <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600">
//               {event.bannerImage ? (
//                 <img
//                   src={`http://localhost:5000${event.bannerImage}`}
//                   alt="event banner"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-white text-4xl">
//                   📅
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             <div className="p-5">
//               <div className="flex justify-between items-start mb-2">
//                 <h2 className="font-semibold text-lg text-gray-900 line-clamp-2">
//                   {event.title}
//                 </h2>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.liveStatus)}`}>
//                   {event.liveStatus}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                 {event.shortDescription}
//               </p>

//               <div className="text-xs text-gray-500 space-y-1 mb-3">
//                 <p>📅 {new Date(event.startDate).toLocaleDateString()} — {new Date(event.endDate).toLocaleDateString()}</p>
//                 <p>📍 {event.venueOverview}</p>
//                 {event.coordinator && (
//                   <p>👤 Coordinator: {event.coordinator.fullName}</p>
//                 )}
//               </div>

//               {/* Publish Status */}
//               <div className="mb-3">
//                 <span
//                   className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                     event.isPublished
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {event.isPublished ? "✅ Published" : "📝 Draft"}
//                 </span>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-2 mt-4">
//                 <button
//                   disabled={event.liveStatus !== "upcoming"}
//                   onClick={() => navigate(`/hod/events/edit/${event._id}`)}
//                   title={event.liveStatus !== "upcoming" ? "Can only edit upcoming events" : "Edit event"}
//                   className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     event.liveStatus === "upcoming"
//                       ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   }`}
//                 >
//                   ✏️ Edit
//                 </button>

//                 <button
//                   onClick={() => handlePublishToggle(event)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
//                     event.isPublished
//                       ? "bg-yellow-500 hover:bg-yellow-600 text-white"
//                       : "bg-blue-600 hover:bg-blue-700 text-white"
//                   }`}
//                 >
//                   {event.isPublished ? "👁️ Unpublish" : "📢 Publish"}
//                 </button>

//                 <button
//                   disabled={event.liveStatus !== "upcoming"}
//                   onClick={() => handleDelete(event._id)}
//                   title={event.liveStatus !== "upcoming" ? "Can only delete upcoming events" : "Delete event"}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     event.liveStatus === "upcoming"
//                       ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   }`}
//                 >
//                   🗑️ Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageEvents;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyEvents,
  deleteEvent,
  publishEvent,
  unpublishEvent
} from "../../api/event.api";
import toast from "react-hot-toast";

const ManageEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await toast.promise(
        deleteEvent(id),
        {
          loading: "Deleting event...",
          success: "Event deleted successfully ✅",
          error: (err) => err.response?.data?.message || "Delete failed"
        }
      );

      setEvents(prev => prev.filter(event => event._id !== id));

    } catch (error) {}
  };

  const handlePublishToggle = async (event) => {

    try {

      if (event.isPublished) {

        await toast.promise(
          unpublishEvent(event._id),
          {
            loading: "Unpublishing event...",
            success: "Event unpublished successfully ✅",
            error: (err) => err.response?.data?.message || "Unpublish failed"
          }
        );

      } else {

        await toast.promise(
          publishEvent(event._id),
          {
            loading: "Publishing event...",
            success: "Event published successfully ✅",
            error: (err) => err.response?.data?.message || "Publish failed"
          }
        );

      }

      setEvents(prev =>
        prev.map(e =>
          e._id === event._id
            ? { ...e, isPublished: !e.isPublished }
            : e
        )
      );

    } catch (error) {}
  };

  const getStatusColor = (status) => {
    if (status === "upcoming") return "bg-orange-100 text-orange-700";
    if (status === "ongoing") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Events
          </h1>
          <p className="text-gray-600">
            Create, edit, publish, and manage all your events
          </p>
        </div>

        <button
          onClick={() => navigate("/hod/events/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg"
        >
          ➕ Create New Event
        </button>
      </div>

      {/* ================= EVENTS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map(event => {

          const isUpcoming = event.liveStatus === "upcoming";
          const isOngoing = event.liveStatus === "ongoing";
          const isCompleted = event.liveStatus === "completed";

          return (

            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition border"
            >

              {/* Banner */}
              <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600">
                {event.bannerImage ? (
                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt="event banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    📅
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">

                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg">
                    {event.title}
                  </h2>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.liveStatus)}`}>
                    {event.liveStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {event.shortDescription}
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    📅 {new Date(event.startDate).toLocaleDateString()} —{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p>📍 {event.venueOverview}</p>
                </div>

                {/* Publish Badge */}
                <div className="my-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      event.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {event.isPublished ? "✅ Published" : "📝 Draft"}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {/* EDIT */}
                  <button
                    disabled={!isUpcoming}
                    onClick={() => navigate(`/hod/events/edit/${event._id}`)}
                    title={!isUpcoming ? "Editing allowed only before event starts" : ""}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                      isUpcoming
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    ✏️ Edit
                  </button>

                  {/* PUBLISH / UNPUBLISH */}
                  <button
                    disabled={!isUpcoming}
                    onClick={() => handlePublishToggle(event)}
                    title={!isUpcoming ? "Publishing locked after event start" : ""}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isUpcoming
                        ? event.isPublished
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {event.isPublished ? "👁️ Unpublish" : "📢 Publish"}
                  </button>

                  {/* DELETE */}
                  <button
                    disabled={!isUpcoming}
                    onClick={() => handleDelete(event._id)}
                    title={!isUpcoming ? "Delete allowed only before event starts" : ""}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isUpcoming
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>
            </div>

          );

        })}

      </div>
    </div>
  );
};

export default ManageEvents;
