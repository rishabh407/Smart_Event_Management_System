// import { useEffect, useState } from "react";
// import { getAllEvents } from "../../api/event.api";

// const Events = () => {

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchEvents = async () => {

//     try {

//       const res = await getAllEvents();
//       setEvents(res.data);
//       console.log(res.data);
//     } catch (error) {

//       console.error(error);

//     } finally {

//       setLoading(false);

//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   if (loading) {
//     return <div>Loading events...</div>;
//   }

//   return (
//     <div>

//       <h1 className="text-2xl font-bold mb-4">Events</h1>

//       {events.length === 0 ? (
//         <p>No events available</p>
//       ) : (

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           {events.map((event) => (

//             <div
//               key={event._id}
//               className="bg-white p-4 rounded shadow"
//             >

//               <h2 className="text-lg font-semibold">
//                 {event.title}
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Venue: {event.venueOverview}
//               </p>

//               <p className="text-sm text-gray-500">
//                 Date: {new Date(event.startDate).toLocaleDateString()}
//               </p>

//               <button
//                 className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//               >
//                 View Competitions
//               </button>

//             </div>

//           ))}

//         </div>

//       )}

//     </div>
//   );
// };

// export default Events;

import { useEffect, useState } from "react";
import { getAllEvents } from "../../api/event.api";
import { useNavigate } from "react-router-dom";

const Events = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading events...</div>;
  }

  return (
    <div>

      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-sm text-gray-500">
          {events.length} Events Available
        </p>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No events available currently
        </div>
      )}

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map((event) => (

          <div
            key={event._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >

            {/* Banner Image */}
            <div className="h-40 bg-gray-200">
              <img
src={`http://localhost:5000${event.bannerImage}`}
                alt="event banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">

              <h2 className="text-lg font-semibold mb-1">
                {event.title}
              </h2>

              <p className="text-sm text-gray-600 mb-2">
                {event.shortDescription}
              </p>

              <div className="text-xs text-gray-500 space-y-1">

                <p>
                  📍 {event.venueOverview}
                </p>

                <p>
                  📅 {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>

              </div>

              {/* Button */}
              <button
                // onClick={() =>
                //   navigate(`/student/events/${event._id}`)
                // }
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                View Competitions
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Events;
