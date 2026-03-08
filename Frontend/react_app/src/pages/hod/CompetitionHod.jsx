// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getEventCompetitions } from "../../api/event.api";

// const CompetitionHod = () => {

//   const { eventId } = useParams();
//   const navigate = useNavigate();

//   const [competitions, setCompetitions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCompetitions = async () => {
//     try {

//       setLoading(true);

//       const res = await getEventCompetitions(eventId);

//       setCompetitions(Array.isArray(res.data) ? res.data : []);

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

//   const formatDate = (date) => {
//     return new Date(date).toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short"
//     });
//   };

//   const getStatusColor = (status) => {
//     if (status === "upcoming") return "bg-blue-100 text-blue-700";
//     if (status === "ongoing") return "bg-green-100 text-green-700";
//     if (status === "completed") return "bg-gray-200 text-gray-700";
//     return "bg-gray-200 text-gray-700";
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
//       </div>
//     );
//   }

//   return (

//     <div className="p-6">

//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-6">

//         <div>
//           <h1 className="text-3xl font-bold">
//             Competitions
//           </h1>
//           <p className="text-gray-600">
//             Competitions created by coordinators for this event
//           </p>
//         </div>

//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
//         >
//           ← Back
//         </button>

//       </div>


//       {/* EMPTY STATE */}

//       {competitions.length === 0 ? (

//         <div className="bg-white p-10 rounded shadow text-center text-gray-500">
//           No competitions created yet
//         </div>

//       ) : (

//         <div className="bg-white rounded shadow overflow-x-auto">

//           <table className="w-full text-sm">

//             <thead className="bg-gray-100">

//               <tr>
//                 <th className="p-3 text-left">Competition</th>
//                 <th className="p-3 text-left">Type</th>
//                 <th className="p-3 text-left">Venue</th>
//                 <th className="p-3 text-left">Teachers</th>
//                 <th className="p-3 text-left">Participants</th>
//                 <th className="p-3 text-left">Start</th>
//                 <th className="p-3 text-left">Status</th>
//               </tr>

//             </thead>

//             <tbody>

//               {competitions.map(comp => {

//                 const teacherNames =
//                   comp.assignedTeachers?.map(t => t.teacher?.fullName) || [];

//                 return (

//                   <tr
//                     key={comp._id}
//                     className="border-t hover:bg-gray-50"
//                   >

//                     <td className="p-3">

//                       <p className="font-semibold">
//                         {comp.name}
//                       </p>

//                       <p className="text-gray-500 text-xs">
//                         {comp.shortDescription}
//                       </p>

//                     </td>

//                     <td className="p-3 capitalize">
//                       {comp.type}
//                     </td>

//                     <td className="p-3">
//                       {comp.venue}
//                     </td>

//                     <td className="p-3">

//                       <div className="flex flex-wrap gap-1">

//                         {teacherNames.map((name, i) => (

//                           <span
//                             key={i}
//                             className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
//                           >
//                             {name}
//                           </span>

//                         ))}

//                       </div>

//                     </td>

//                     <td className="p-3">
//                       {comp.maxParticipants || "Unlimited"}
//                     </td>

//                     <td className="p-3">
//                       {formatDate(comp.startTime)}
//                     </td>

//                     <td className="p-3">

//                       <span
//                         className={`px-2 py-1 rounded text-xs ${getStatusColor(comp.status)}`}
//                       >
//                         {comp.status}
//                       </span>

//                     </td>

//                   </tr>

//                 );

//               })}

//             </tbody>

//           </table>

//         </div>

//       )}

//     </div>

//   );

// };

// export default CompetitionHod;

// import { useEffect, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getEventCompetitions } from "../../api/event.api";

// const CompetitionHod = () => {

//   const { eventId } = useParams();
//   const navigate = useNavigate();

//   const [competitions, setCompetitions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   /* ================= FETCH DATA ================= */

//   const fetchCompetitions = async () => {
//     try {

//       setLoading(true);

//       const res = await getEventCompetitions(eventId);

//       setCompetitions(Array.isArray(res.data) ? res.data : []);

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

//   /* ================= FILTERED DATA ================= */

//   const filteredCompetitions = useMemo(() => {

//     return competitions.filter(comp => {

//       const matchSearch =
//         comp.name?.toLowerCase().includes(search.toLowerCase());

//       const matchStatus =
//         filter === "all" ? true : comp.status === filter;

//       return matchSearch && matchStatus;

//     });

//   }, [competitions, search, filter]);

//   /* ================= UTILITIES ================= */

//   const formatDate = (date) => {
//     return new Date(date).toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short"
//     });
//   };

//   const getStatusColor = (status) => {

//     if (status === "upcoming") return "bg-blue-100 text-blue-700";
//     if (status === "ongoing") return "bg-green-100 text-green-700";
//     if (status === "completed") return "bg-gray-200 text-gray-700";

//     return "bg-gray-200 text-gray-700";

//   };

//   /* ================= LOADING ================= */

//   if (loading) {

//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
//       </div>
//     );

//   }

//   return (

//     <div className="p-4 md:p-6">

//       {/* HEADER */}

//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

//         <div>

//           <h1 className="text-2xl md:text-3xl font-bold">
//             Competitions
//           </h1>

//           <p className="text-gray-600 text-sm md:text-base">
//             Competitions created by coordinators for this event
//           </p>

//         </div>

//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-fit"
//         >
//           ← Back
//         </button>

//       </div>


//       {/* SEARCH + FILTER BAR */}

//       <div className="bg-white rounded shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center">

//         <input
//           type="text"
//           placeholder="Search competition..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full md:w-72"
//         />

//         <div className="flex gap-2 flex-wrap">

//           {["all", "upcoming", "ongoing", "completed"].map(type => (

//             <button
//               key={type}
//               onClick={() => setFilter(type)}
//               className={`px-3 py-1 rounded text-sm ${
//                 filter === type
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             >
//               {type.toUpperCase()}
//             </button>

//           ))}

//         </div>

//       </div>


//       {/* EMPTY STATE */}

//       {filteredCompetitions.length === 0 ? (

//         <div className="bg-white p-10 rounded shadow text-center text-gray-500">
//           No competitions found
//         </div>

//       ) : (

//         <div className="bg-white rounded shadow overflow-x-auto">

//           <table className="w-full text-sm">

//             {/* TABLE HEADER */}

//             <thead className="bg-gray-100 sticky top-0">

//               <tr>

//                 <th className="p-3 text-left">Competition</th>
//                 <th className="p-3 text-left">Type</th>
//                 <th className="p-3 text-left">Venue</th>
//                 <th className="p-3 text-left">Teachers</th>
//                 <th className="p-3 text-left">Participants</th>
//                 <th className="p-3 text-left">Start</th>
//                 <th className="p-3 text-left">Status</th>

//               </tr>

//             </thead>

//             {/* TABLE BODY */}

//             <tbody>

//               {filteredCompetitions.map(comp => {

//                 const teacherNames =
//                   comp.assignedTeachers?.map(t => t.teacher?.fullName) || [];

//                 return (

//                   <tr
//                     key={comp._id}
//                     className="border-t hover:bg-gray-50"
//                   >

//                     {/* NAME */}

//                     <td className="p-3 min-w-[220px]">

//                       <p className="font-semibold">
//                         {comp.name}
//                       </p>

//                       <p className="text-gray-500 text-xs">
//                         {comp.shortDescription}
//                       </p>

//                     </td>


//                     {/* TYPE */}

//                     <td className="p-3 capitalize">
//                       {comp.type}
//                     </td>


//                     {/* VENUE */}

//                     <td className="p-3">
//                       {comp.venue}
//                     </td>


//                     {/* TEACHERS */}

//                     <td className="p-3">

//                       <div className="flex flex-wrap gap-1">

//                         {teacherNames.map((name, i) => (

//                           <span
//                             key={i}
//                             className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
//                           >
//                             {name}
//                           </span>

//                         ))}

//                       </div>

//                     </td>


//                     {/* PARTICIPANTS */}

//                     <td className="p-3">
//                       {comp.maxParticipants || "Unlimited"}
//                     </td>


//                     {/* START TIME */}

//                     <td className="p-3 whitespace-nowrap">
//                       {formatDate(comp.startTime)}
//                     </td>


//                     {/* STATUS */}

//                     <td className="p-3">

//                       <span
//                         className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(comp.status)}`}
//                       >
//                         {comp.status}
//                       </span>

//                     </td>

//                   </tr>

//                 );

//               })}

//             </tbody>

//           </table>

//         </div>

//       )}

//     </div>

//   );

// };

// export default CompetitionHod;

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventCompetitions } from "../../api/event.api";

const CompetitionHod = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= FETCH DATA ================= */

  const fetchCompetitions = async () => {
    try {

      setLoading(true);

      const res = await getEventCompetitions(eventId);

      setCompetitions(Array.isArray(res.data) ? res.data : []);

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

  /* ================= FILTERED DATA ================= */

  const filteredCompetitions = useMemo(() => {

    return competitions.filter(comp => {

      const matchSearch =
        comp.name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filter === "all" ? true : comp.status === filter;

      return matchSearch && matchStatus;

    });

  }, [competitions, search, filter]);

  /* ================= UTILITIES ================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getStatusColor = (status) => {

    if (status === "upcoming") return "bg-blue-100 text-blue-700";
    if (status === "ongoing") return "bg-green-100 text-green-700";
    if (status === "completed") return "bg-gray-200 text-gray-700";

    return "bg-gray-200 text-gray-700";

  };

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  }

  return (

    <div className="px-3 sm:px-4 md:px-6 py-4 w-full">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Competitions
          </h1>

          <p className="text-gray-600 text-sm sm:text-base">
            Competitions created by coordinators for this event
          </p>

        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-fit"
        >
          ← Back
        </button>

      </div>

      {/* SEARCH + FILTER */}

      <div className="bg-white rounded shadow p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

        <input
          type="text"
          placeholder="Search competition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full lg:w-80"
        />

        <div className="flex flex-wrap gap-2">

          {["all", "upcoming", "ongoing", "completed"].map(type => (

            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded text-xs sm:text-sm ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {type.toUpperCase()}
            </button>

          ))}

        </div>

      </div>


      {/* EMPTY STATE */}

      {filteredCompetitions.length === 0 ? (

        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No competitions found
        </div>

      ) : (

        <>

          {/* ================= MOBILE CARD VIEW ================= */}

          <div className="md:hidden space-y-4">

            {filteredCompetitions.map(comp => {

              const teacherNames =
                comp.assignedTeachers?.map(t => t.teacher?.fullName) || [];

              return (

                <div
                  key={comp._id}
                  className="bg-white rounded shadow p-4 space-y-2"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-semibold text-lg">
                        {comp.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {comp.shortDescription}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(comp.status)}`}
                    >
                      {comp.status}
                    </span>

                  </div>

                  <div className="text-sm space-y-1">

                    <p>
                      <span className="font-medium">Type:</span> {comp.type}
                    </p>

                    <p>
                      <span className="font-medium">Venue:</span> {comp.venue}
                    </p>

                    <p>
                      <span className="font-medium">Participants:</span>{" "}
                      {comp.maxParticipants || "Unlimited"}
                    </p>

                    <p>
                      <span className="font-medium">Start:</span>{" "}
                      {formatDate(comp.startTime)}
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">

                    {teacherNames.map((name, i) => (

                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                      >
                        {name}
                      </span>

                    ))}

                  </div>

                </div>

              );

            })}

          </div>


          {/* ================= DESKTOP TABLE VIEW ================= */}

          <div className="hidden md:block bg-white rounded shadow">

            <div className="w-full overflow-x-auto">

              <table className="min-w-[900px] w-full text-sm">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-3 text-left">Competition</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Venue</th>
                    <th className="p-3 text-left">Teachers</th>
                    <th className="p-3 text-left">Participants</th>
                    <th className="p-3 text-left">Start</th>
                    <th className="p-3 text-left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCompetitions.map(comp => {

                    const teacherNames =
                      comp.assignedTeachers?.map(t => t.teacher?.fullName) || [];

                    return (

                      <tr
                        key={comp._id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-3 min-w-[220px]">

                          <p className="font-semibold">
                            {comp.name}
                          </p>

                          <p className="text-gray-500 text-xs">
                            {comp.shortDescription}
                          </p>

                        </td>

                        <td className="p-3 capitalize">
                          {comp.type}
                        </td>

                        <td className="p-3">
                          {comp.venue}
                        </td>

                        <td className="p-3">

                          <div className="flex flex-wrap gap-1">

                            {teacherNames.map((name, i) => (

                              <span
                                key={i}
                                className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                              >
                                {name}
                              </span>

                            ))}

                          </div>

                        </td>

                        <td className="p-3">
                          {comp.maxParticipants || "Unlimited"}
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          {formatDate(comp.startTime)}
                        </td>

                        <td className="p-3">

                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(comp.status)}`}
                          >
                            {comp.status}
                          </span>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        </>

      )}

    </div>

  );

};

export default CompetitionHod;