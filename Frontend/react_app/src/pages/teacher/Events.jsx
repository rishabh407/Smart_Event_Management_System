// import React, { useEffect, useState } from "react";
// import { getAllEvents } from "../../api/event.api";
// import { useNavigate } from "react-router-dom";

// const Events = () => {

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {

//     const fetchEvents = async () => {
//       try {
//         const res = await getAllEvents();
//         setEvents(res.data || []);
//       } catch (err) {
//         console.error("Event fetch error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();

//   }, []);

//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-bold mb-6">
//         College Events
//       </h1>

//       {loading && <p>Loading events...</p>}

//       {!loading && events.length === 0 && (
//         <p>No events found</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

//         {events.map(event => (

//           <div
//             key={event._id}
//             onClick={() =>
//               navigate(`/teacher/events/${event._id}`)
//             }
//             className="bg-white shadow rounded-lg p-5 cursor-pointer hover:shadow-lg transition"
//           >

//             <h2 className="font-bold text-lg">
//               {event.name}
//             </h2>

//             <p className="text-sm text-gray-600 mt-2">
//               {event.description}
//             </p>

//             <p className="text-sm mt-2">
//               <b>Date:</b>{" "}
//               {new Date(event.startDate).toLocaleDateString()}
//             </p>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default Events;

