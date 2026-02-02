// import React, { useEffect, useState, useCallback } from "react";
// import { getinchargeteacherscompetitions } from "../../api/teacher.api";
// import { useNavigate } from "react-router-dom";

// const AssignedCompetitons = () => {

//   const [competitions, setCompetitions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const navigate = useNavigate();

//   // ================= FETCH DATA =================

//   const fetchAssigned = useCallback(async () => {

//     try {
//       const res = await getinchargeteacherscompetitions();
//       setCompetitions(res?.data || []);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }

//   }, []);

//   useEffect(() => {
//     fetchAssigned();
//   }, [fetchAssigned]);

//   // ================= LIVE CLOCK =================

//   useEffect(() => {

//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);

//   }, []);

//   // ================= STATUS LOGIC =================

//   const getCompetitionStatus = (startTime, endTime) => {

//     const now = currentTime;
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     if (now < start) return "UPCOMING";
//     if (now >= start && now <= end) return "ONGOING";

//     return "COMPLETED";
//   };

//   // ================= COUNTDOWN =================

//   const getCountdown = (startTime, endTime) => {

//     const now = currentTime;
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     let diff;

//     if (now < start) diff = start - now;
//     else if (now <= end) diff = end - now;
//     else return "Finished";

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);

//     return `${hours}h ${minutes}m`;
//   };

//   // ================= LAST 5 MIN ALERT =================

//   const getLast5MinTimer = (targetTime) => {

//     if (!targetTime) return null;

//     const diff = new Date(targetTime) - currentTime;

//     if (diff > 0 && diff <= 5 * 60 * 1000) {

//       const minutes = Math.floor(diff / 60000);
//       const seconds = Math.floor((diff / 1000) % 60);

//       return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//     }

//     return null;
//   };

//   // ================= UI =================

//   return (
//     <div className="p-4 md:p-6">

//       <h1 className="text-2xl font-bold mb-6">
//         My Assigned Competitions
//       </h1>

//       {/* LOADING */}

//       {loading && (
//         <p className="text-gray-500">
//           Loading competitions...
//         </p>
//       )}

//       {/* EMPTY */}

//       {!loading && competitions.length === 0 && (
//         <div className="bg-white p-6 rounded shadow text-center">
//           <p className="text-gray-500">
//             No competitions assigned yet.
//           </p>
//         </div>
//       )}

//       {/* GRID */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

//         {competitions.map((data) => {

//           const status = getCompetitionStatus(
//             data.startTime,
//             data.endTime
//           );

//           const countdown = getCountdown(
//             data.startTime,
//             data.endTime
//           );

//           const registerAlert = getLast5MinTimer(data.registrationDeadline);
//           const startAlert = getLast5MinTimer(data.startTime);
//           const endAlert = getLast5MinTimer(data.endTime);

//           return (

//             <div
//               key={data._id}
//               className={`bg-white rounded-lg shadow p-5 border transition
//               ${status === "ONGOING"
//                 ? "border-green-500"
//                 : "hover:shadow-lg"}
//               `}
//             >

//               {/* HEADER */}

//               <div className="flex justify-between items-center mb-3">

//                 <h2 className="text-lg font-bold truncate">
//                   {data.name}
//                 </h2>

//                 <span
//                   className={`px-3 py-1 text-sm rounded-full font-medium
//                   ${
//                     status === "ONGOING"
//                       ? "bg-green-100 text-green-700 animate-pulse"
//                       : status === "UPCOMING"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {status}
//                 </span>

//               </div>

//               {/* ALERTS */}

//               {registerAlert && (
//                 <p className="text-xs sm:text-sm font-bold text-red-600 animate-pulse">
//                   ⏳ Registration closes in: {registerAlert}
//                 </p>
//               )}

//               {startAlert && status === "UPCOMING" && (
//                 <p className="text-xs sm:text-sm font-bold text-orange-600 animate-pulse">
//                   ▶️ Competition starts in: {startAlert}
//                 </p>
//               )}

//               {endAlert && status === "ONGOING" && (
//                 <p className="text-xs sm:text-sm font-bold text-purple-600 animate-pulse">
//                   ⏹ Competition ends in: {endAlert}
//                 </p>
//               )}

//               {/* COUNTDOWN */}

//               <p className="text-sm font-semibold mb-2 text-indigo-600">

//                 {status === "UPCOMING" && `Starts in: ${countdown}`}
//                 {status === "ONGOING" && `Ends in: ${countdown}`}
//                 {status === "COMPLETED" && "Competition Finished"}

//               </p>

//               {/* DETAILS */}

//               <div className="text-xs sm:text-sm text-gray-700 space-y-1">

//                 <p><b>Type:</b> {data.type}</p>
//                 <p><b>Venue:</b> {data.venue}</p>

//                 <p>
//                   <b>Team Size:</b> {data.minTeamSize} - {data.maxTeamSize}
//                 </p>

//                 <p>
//                   <b>Max Participants:</b> {data.maxParticipants}
//                 </p>

//                 <p>
//                   <b>Start:</b>{" "}
//                   {new Date(data.startTime).toLocaleString()}
//                 </p>

//                 <p>
//                   <b>End:</b>{" "}
//                   {new Date(data.endTime).toLocaleString()}
//                 </p>

//               </div>

//               {/* DESCRIPTION */}

//               <p className="mt-3 text-gray-600 text-sm line-clamp-3">
//                 {data.shortDescription}
//               </p>

//               {/* ACTIONS */}

//               <div className="flex flex-wrap gap-3 mt-4">

//                 <button
//                   disabled={status !== "ONGOING"}
//                   onClick={() =>
//                     navigate(`/teacher/attendance/${data._id}`)
//                   }
//                   className={`px-4 py-2 rounded text-sm text-white
//                   ${
//                     status === "ONGOING"
//                       ? "bg-indigo-600 hover:bg-indigo-700"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   Take Attendance
//                 </button>

//                 <button
//                   disabled={status === "UPCOMING"}
//                   onClick={() =>
//                     navigate(`/teacher/attendance/view/${data._id}`)
//                   }
//                   className={`px-4 py-2 rounded text-sm
//                   ${
//                     status === "UPCOMING"
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-gray-200 hover:bg-gray-300"
//                   }`}
//                 >
//                   View Attendance
//                 </button>

//                 <button
//                   onClick={() =>
//                     navigate(`/teacher/registrations/${data._id}`)
//                   }
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
//                 >
//                   View Registrations
//                 </button>

//               </div>

//             </div>

//           );

//         })}

//       </div>

//     </div>
//   );
// };

// export default AssignedCompetitons;


import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { useNavigate } from "react-router-dom";

const AssignedCompetitons = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ================= FETCH DATA =================

  const fetchAssigned = useCallback(async () => {

    try {
      const res = await getinchargeteacherscompetitions();
      setCompetitions(res?.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  // ================= LIVE CLOCK =================

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // ================= STATUS =================

  const getCompetitionStatus = (startTime, endTime) => {

    const now = currentTime;

    if (now < new Date(startTime)) return "UPCOMING";
    if (now <= new Date(endTime)) return "ONGOING";

    return "COMPLETED";
  };

  // ================= COUNTDOWN =================

  const getCountdown = (startTime, endTime) => {

    const now = currentTime;

    let diff;

    if (now < new Date(startTime)) diff = new Date(startTime) - now;
    else if (now <= new Date(endTime)) diff = new Date(endTime) - now;
    else return "Finished";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff / 60000) % 60);

    return `${h}h ${m}m`;
  };

  // ================= FILTER + SEARCH =================

  const filteredCompetitions = useMemo(() => {

    return competitions.filter(comp => {

      const status = getCompetitionStatus(
        comp.startTime,
        comp.endTime
      );

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesSearch =
        comp.name.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;

    });

  }, [competitions, search, statusFilter, currentTime]);

  // ================= UI =================

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-bold">
          Assigned Competitions
        </h1>

        <button
          onClick={() => navigate("/teacher/events")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
        >
          ⬅ Back
        </button>

      </div>

      {/* SEARCH BAR */}

      <input
        type="text"
        placeholder="🔍 Search competition..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* FILTER BUTTONS */}

      <div className="flex flex-wrap gap-3 mb-6">

        {["ALL", "UPCOMING", "ONGOING", "COMPLETED"].map(type => (

          <button
            key={type}
            onClick={() => setStatusFilter(type)}
            className={`px-4 py-2 rounded text-sm font-medium transition
            ${
              statusFilter === type
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>

        ))}

      </div>

      {/* LOADING */}

      {loading && (
        <p className="text-gray-500">
          Loading competitions...
        </p>
      )}

      {/* EMPTY */}

      {!loading && filteredCompetitions.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No competitions found.
          </p>
        </div>
      )}

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredCompetitions.map((data) => {

          const status = getCompetitionStatus(
            data.startTime,
            data.endTime
          );

          const countdown = getCountdown(
            data.startTime,
            data.endTime
          );

          return (

            <div
              key={data._id}
              className="bg-white rounded-lg shadow p-5 border hover:shadow-lg transition"
            >

              {/* HEADER */}

              <div className="flex justify-between items-center mb-2">

                <h2 className="font-bold text-lg truncate">
                  {data.name}
                </h2>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : status === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {status}
                </span>

              </div>

              {/* REGISTRATION COUNT */}

              <p className="text-sm text-gray-600 mb-2">
                👥 {data.totalRegistrations || 0} Registered
              </p>

              {/* COUNTDOWN */}

              <p className="text-indigo-600 text-sm font-semibold mb-2">

                {status === "UPCOMING" && `Starts in: ${countdown}`}
                {status === "ONGOING" && `Ends in: ${countdown}`}
                {status === "COMPLETED" && "Competition Finished"}

              </p>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3 mt-4">

                <button
                  disabled={status !== "ONGOING"}
                  onClick={() =>
                    navigate(`/teacher/attendance/${data._id}`)
                  }
                  className={`px-4 py-2 rounded text-sm text-white
                  ${
                    status === "ONGOING"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Take Attendance
                </button>

                <button
                  disabled={status === "UPCOMING"}
                  onClick={() =>
                    navigate(`/teacher/attendance/view/${data._id}`)
                  }
                  className={`px-4 py-2 rounded text-sm
                  ${
                    status === "UPCOMING"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  View Attendance
                </button>

                <button
                  onClick={() =>
                    navigate(`/teacher/registrations/${data._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Registrations
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default AssignedCompetitons;
