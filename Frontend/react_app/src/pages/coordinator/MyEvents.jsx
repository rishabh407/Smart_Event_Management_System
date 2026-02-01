// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getCoordinatorEvents } from "../../api/event.api";
// import toast from "react-hot-toast";

// const MyEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const res = await getCoordinatorEvents();
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

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your events...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* ================= HEADER ================= */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">My Assigned Events</h1>
//         <p className="text-gray-600 mt-1">Manage competitions for your assigned events</p>
//       </div>

//       {/* ================= EMPTY STATE ================= */}
//       {events.length === 0 && (
//         <div className="bg-white rounded-lg shadow-md p-12 text-center">
//           <div className="text-6xl mb-4">📅</div>
//           <p className="text-gray-500 text-lg mb-2">No events assigned yet</p>
//           <p className="text-gray-400 text-sm">
//             Events will appear here once HOD assigns them to you.
//           </p>
//         </div>
//       )}

//       {/* ================= EVENTS GRID ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(event => (
//           <div
//             key={event._id}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
//           >
//             {/* Banner */}
//             <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-600">
//               {event.bannerImage ? (
//                 <img
//                   src={`http://localhost:5000${event.bannerImage}`}
//                   alt="event banner"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-white text-4xl">
//                   🎯
//                 </div>
//               )}
//             </div>

//             <div className="p-5">
//               {/* Title + Status */}
//               <div className="flex justify-between items-start mb-3">
//                 <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
//                   {event.title}
//                 </h2>
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full font-medium ${
//                     event.liveStatus === "upcoming"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : event.liveStatus === "ongoing"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {event.liveStatus}
//                 </span>
//               </div>

//               {/* Description */}
//               <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                 {event.shortDescription}
//               </p>

//               {/* Details */}
//               <div className="text-sm text-gray-500 space-y-1 mb-4">
//                 <p>📍 {event.venueOverview}</p>
//                 <p>📅 Start: {new Date(event.startDate).toLocaleDateString()}</p>
//                 <p>⏳ End: {new Date(event.endDate).toLocaleDateString()}</p>
//               </div>

//               {/* Action Button */}
//               <button
//                 onClick={() =>
//                   navigate(`/coordinator/events/${event._id}/competitions`)
//                 }
//                 className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
//               >
//                 📋 Manage Competitions
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyEvents;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordinatorEvents } from "../../api/event.api";
import toast from "react-hot-toast";

const MyEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {
    try {

      setLoading(true);

      const res = await getCoordinatorEvents();
      setEvents(res.data || []);

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

  // ================= STATUS LOGIC =================

  const getEventStatus = (startDate, endDate) => {

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading your events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Assigned Events
        </h1>
        <p className="text-gray-600 mt-1">
          Manage competitions for your assigned events
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}

      {events.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-12 text-center">

          <div className="text-6xl mb-4">📅</div>

          <p className="text-gray-500 text-lg mb-2">
            No events assigned yet
          </p>

          <p className="text-gray-400 text-sm">
            Events will appear here once HOD assigns them to you.
          </p>

        </div>

      )}

      {/* ================= EVENTS GRID ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map((event) => {

          const status = getEventStatus(
            event.startDate,
            event.endDate
          );

          return (

            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
            >

              {/* ================= BANNER ================= */}

              <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-600">

                {event.bannerImage ? (

                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt="event banner"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    🎯
                  </div>

                )}

              </div>

              {/* ================= CONTENT ================= */}

              <div className="p-5">

                {/* TITLE + STATUS */}

                <div className="flex justify-between items-start mb-3">

                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h2>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      status === "UPCOMING"
                        ? "bg-yellow-100 text-yellow-700"
                        : status === "ONGOING"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.shortDescription}
                </p>

                {/* DETAILS */}

                <div className="text-sm text-gray-500 space-y-1 mb-4">

                  <p>📍 {event.venueOverview}</p>

                  <p>
                    📅 Start:{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>

                  <p>
                    ⏳ End:{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>

                </div>

                {/* ACTION BUTTON */}

                <button
                  disabled={status === "COMPLETED"}
                  onClick={() =>
                    navigate(`/coordinator/events/${event._id}/competitions`)
                  }
                  className={`w-full px-4 py-3 rounded-lg font-medium transition shadow-md ${
                    status === "COMPLETED"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  📋 Manage Competitions
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default MyEvents;
