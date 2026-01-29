import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordinatorEvents } from "../../api/event.api";
const MyEvents = () => {

 const [events, setEvents] = useState([]);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
 const fetchevents=async()=>{
  await getCoordinatorEvents()
   .then(res => {
    console.log(res.data);
    setEvents(res.data);
    setLoading(false);
   })
   .catch(err => {
    console.log(err);
    setLoading(false);
   });
 }
 useEffect(() => {
  fetchevents();
 }, []);

if (loading) {
 return (
  <div className="text-center mt-10 text-gray-600">
    Loading your events...
  </div>
 );
}

 return (

  <div>

   <h1 className="text-2xl font-bold mb-5">
    My Assigned Events
   </h1>

   {events.length === 0 && (
    <p className="text-gray-500">
     No events assigned yet.
    </p>
   )}

{events.map(event => (

  <div
    key={event._id}
    className="bg-white rounded-lg shadow mb-4 overflow-hidden"
  >

    {/* Banner */}
    <img
      src={`http://localhost:5000${event.bannerImage}`}
      alt="event banner"
      className="w-full h-40 object-cover"
    />

    <div className="p-4">

      {/* Title + Status */}
      <div className="flex justify-between items-center mb-2">

        <h2 className="text-lg font-semibold">
          {event.title}
        </h2>

        <span
          className={`px-3 py-1 text-sm rounded-full ${
            event.liveStatus === "upcoming"
              ? "bg-yellow-100 text-yellow-700"
              : event.liveStatus === "ongoing"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {event.liveStatus}
        </span>

      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-2">
        {event.shortDescription}
      </p>

      {/* Venue + Dates */}
      <div className="text-sm text-gray-500 mb-3">

        <p>
          📍 Venue: {event.venueOverview}
        </p>

        <p>
          📅 Start: {new Date(event.startDate).toLocaleDateString()}
        </p>

        <p>
          ⏳ End: {new Date(event.endDate).toLocaleDateString()}
        </p>

      </div>

      {/* Action Button */}
      <button
        onClick={() =>
          navigate(`/coordinator/events/${event._id}/competitions`)
        }
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Manage Competitions
      </button>

    </div>

  </div>

))}

  </div>

 );
};

export default MyEvents;
