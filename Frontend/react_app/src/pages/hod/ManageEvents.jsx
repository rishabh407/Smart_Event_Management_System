// import { useEffect, useState } from "react";
// import { getAllEvents, deleteEvent } from "../../api/event.api";
// import { useNavigate } from "react-router-dom";

// const ManageEvents = () => {

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // ---------------- FETCH EVENTS ----------------

//   const fetchEvents = async () => {
//     try {
//       const res = await getAllEvents();
//       setEvents(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // ---------------- DELETE EVENT ----------------

//   const handleDelete = async (id) => {

//     const confirm = window.confirm(
//       "Are you sure you want to delete this event?"
//     );

//     if (!confirm) return;

//     try {

//       await deleteEvent(id);

//       // Remove from UI instantly
//       setEvents(prev =>
//         prev.filter(event => event._id !== id)
//       );

//     } catch (error) {

//       alert(error.response?.data?.message || "Delete failed");

//     }
//   };

//   // ---------------- STATUS BADGE ----------------

//   const getStatusColor = (status) => {

//     if (status === "upcoming") return "text-orange-500";
//     if (status === "ongoing") return "text-green-600";
//     return "text-red-600";

//   };

//   // ---------------- UI ----------------

//   if (loading) {
//     return (
//       <div className="text-center mt-10">
//         Loading events...
//       </div>
//     );
//   }

//   return (
//     <div>

//       <div className="flex justify-between items-center mb-6">

//         <h1 className="text-2xl font-bold">
//           Manage Events
//         </h1>

//         <button
//           onClick={() => navigate("/hod/events/create")}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           + Create Event
//         </button>

//       </div>

//       {events.length === 0 && (
//         <p className="text-gray-500">
//           No events created yet
//         </p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {events.map(event => (

//           <div
//             key={event._id}
//             className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
//           >

//             {/* IMAGE */}

//             <div className="h-40 bg-gray-200">

//               {event.bannerImage && (
//                 <img
//                   src={`http://localhost:5000${event.bannerImage}`}
//                   alt="event"
//                   className="w-full h-full object-cover"
//                 />
//               )}

//             </div>

//             {/* CONTENT */}

//             <div className="p-4">

//               <h2 className="font-semibold text-lg">
//                 {event.title}
//               </h2>

//               <p className="text-sm text-gray-600 mt-1">
//                 {event.shortDescription}
//               </p>

//               <p className="text-xs text-gray-500 mt-2">
//                 📅 {new Date(event.startDate).toLocaleDateString()} —{" "}
//                 {new Date(event.endDate).toLocaleDateString()}
//               </p>

//               <p className="text-xs mt-1">
//                 Coordinator:{" "}
//                 <span className="font-medium">
//                   {event.coordinator?.fullName}
//                 </span>
//               </p>

//               {/* STATUS */}

//               <p className={`mt-2 font-semibold ${getStatusColor(event.liveStatus)}`}>
//                 {event.liveStatus.toUpperCase()}
//               </p>

//               {/* ACTION BUTTONS */}

//               <div className="flex justify-between mt-4">

//                 <button
//                   disabled={event.liveStatus !== "upcoming"}
//                   onClick={() =>
//                     navigate(`/hod/events/edit/${event._id}`)
//                   }
//                   className={`px-3 py-1 rounded text-white
//                     ${
//                       event.liveStatus === "upcoming"
//                         ? "bg-green-600 hover:bg-green-700"
//                         : "bg-gray-400 cursor-not-allowed"
//                     }
//                   `}
//                 >
//                   Edit
//                 </button>

//                 {/* <button
//                   onClick={() => handleDelete(event._id)}
//                   className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
//                 >
//                   Delete
//                 </button> */}

// <button
//   disabled={event.liveStatus !== "upcoming"}
//   onClick={() => handleDelete(event._id)}
//   className={`px-3 py-1 rounded text-white
//     ${
//       event.liveStatus === "upcoming"
//         ? "bg-red-500 hover:bg-red-600"
//         : "bg-gray-400 cursor-not-allowed"
//     }
//   `}
// >
//   Delete
// </button>


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

const ManageEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ---------------- FETCH EVENTS ----------------

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ---------------- DELETE EVENT ----------------

  const handleDelete = async (id) => {

    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirm) return;

    try {

      await deleteEvent(id);

      setEvents(prev =>
        prev.filter(event => event._id !== id)
      );

    } catch (error) {

      alert(error.response?.data?.message || "Delete failed");

    }

  };

  // ---------------- PUBLISH TOGGLE ----------------

  const handlePublishToggle = async (event) => {

    try {

      if (event.isPublished) {

        await unpublishEvent(event._id);

      } else {

        await publishEvent(event._id);

      }

      // Update UI instantly
      setEvents(prev =>
        prev.map(e =>
          e._id === event._id
            ? { ...e, isPublished: !e.isPublished }
            : e
        )
      );

    } catch (error) {

      alert(error.response?.data?.message || "Action failed");

    }

  };

  // ---------------- STATUS COLOR ----------------

  const getStatusColor = (status) => {

    if (status === "upcoming") return "text-orange-500";
    if (status === "ongoing") return "text-green-600";
    return "text-red-600";

  };

  // ---------------- UI ----------------

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading events...
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Manage Events
        </h1>

        <button
          onClick={() => navigate("/hod/events/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Create Event
        </button>

      </div>

      {/* EMPTY STATE */}

      {events.length === 0 && (
        <p className="text-gray-500">
          No events created yet
        </p>
      )}

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map(event => (

          <div
            key={event._id}
            className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
          >

            {/* IMAGE */}

            <div className="h-40 bg-gray-200">

              {event.bannerImage && (
                <img
                  src={`http://localhost:5000${event.bannerImage}`}
                  alt="event"
                  className="w-full h-full object-cover"
                />
              )}

            </div>

            {/* CONTENT */}

            <div className="p-4">

              <h2 className="font-semibold text-lg">
                {event.title}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {event.shortDescription}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                📅 {new Date(event.startDate).toLocaleDateString()}
                {" "}—{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>

              {/* LIVE STATUS */}

              <p className={`mt-2 font-semibold ${getStatusColor(event.liveStatus)}`}>
                {event.liveStatus.toUpperCase()}
              </p>

              {/* PUBLISH STATUS BADGE */}

              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded font-medium
                  ${
                    event.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {event.isPublished ? "PUBLISHED" : "DRAFT"}
              </span>

              {/* ACTIONS */}

              <div className="flex justify-between items-center mt-4">

                {/* EDIT */}

                <button
                  disabled={event.liveStatus !== "upcoming"}
                  onClick={() =>
                    navigate(`/hod/events/edit/${event._id}`)
                  }
                  className={`px-3 py-1 rounded text-white
                    ${
                      event.liveStatus === "upcoming"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Edit
                </button>

                {/* PUBLISH TOGGLE */}

                <button
                  onClick={() => handlePublishToggle(event)}
                  className={`px-3 py-1 rounded text-white
                    ${
                      event.isPublished
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {event.isPublished ? "Unpublish" : "Publish"}
                </button>

                {/* DELETE */}

                <button
                  disabled={event.liveStatus !== "upcoming"}
                  onClick={() => handleDelete(event._id)}
                  className={`px-3 py-1 rounded text-white
                    ${
                      event.liveStatus === "upcoming"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ManageEvents;
