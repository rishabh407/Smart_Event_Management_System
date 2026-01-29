// import React, { useEffect, useState } from 'react'
// import { getinchargeteacherscompetitions } from '../../api/teacher.api';

// const AssignedCompetitons = () => {
//     const [inchargecompetitons, setinchargecompetitons] = useState([]);
//     const fetchassgined=async()=>{
//         try{
//             const res=await getinchargeteacherscompetitions();
//             console.log(res.data);
//             setinchargecompetitons(res.data);
//         }catch(error){
//             console.log(error);
//         }
//     }
//     useEffect(()=>{
//         fetchassgined();
//     },[])
//   return (
//     <div className='bg-black text-blue-500'>
//     <ul>
//   {
//     inchargecompetitons.map((data, index) => (
//       <li key={data._id} className="border p-4 mb-3 rounded">

//         <h2 className="text-xl font-bold">{data.name}</h2>

//         <p>Type: {data.type}</p>
//         <p>Venue: {data.venue}</p>
//         <p>Status: {data.status}</p>
//         <p>Max Participants: {data.maxParticipants}</p>
//         <p>Team Size: {data.minTeamSize} - {data.maxTeamSize}</p>

//         <p>Start Time: {new Date(data.startTime).toLocaleString()}</p>
//         <p>End Time: {new Date(data.endTime).toLocaleString()}</p>

//         <p>Registration Deadline: {new Date(data.registrationDeadline).toLocaleString()}</p>

//         <p>Description: {data.shortDescription}</p>

//       </li>
//     ))
//   }
// </ul>

//     </div>
//   )
// }

// export default AssignedCompetitons

import React, { useEffect, useState } from "react";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { useNavigate } from "react-router-dom";

const AssignedCompetitons = () => {

  const [inchargecompetitons, setinchargecompetitons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const fetchassgined = async () => {
    try {
      const res = await getinchargeteacherscompetitions();
      setinchargecompetitons(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchassgined();
  }, []);

  return (
    <div className="p-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        My Assigned Competitions
      </h1>

      {/* LOADING STATE */}
      {loading && (
        <p className="text-gray-500">Loading competitions...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && inchargecompetitons.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No competitions assigned yet.
          </p>
        </div>
      )}

      {/* COMPETITION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {inchargecompetitons.map((data) => (

          <div
            key={data._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 border"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

              <h2 className="text-lg font-bold">
                {data.name}
              </h2>

              <span
                className={`px-3 py-1 text-sm rounded-full 
                ${
                  data.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.status}
              </span>

            </div>

            {/* DETAILS */}
            <div className="text-sm text-gray-700 space-y-1">

              <p><b>Type:</b> {data.type}</p>
              <p><b>Venue:</b> {data.venue}</p>

              <p>
                <b>Team Size:</b> {data.minTeamSize} - {data.maxTeamSize}
              </p>

              <p>
                <b>Max Participants:</b> {data.maxParticipants}
              </p>

              <p>
                <b>Start:</b>{" "}
                {new Date(data.startTime).toLocaleString()}
              </p>

              <p>
                <b>End:</b>{" "}
                {new Date(data.endTime).toLocaleString()}
              </p>

              <p>
                <b>Last Registration:</b>{" "}
                {new Date(data.registrationDeadline).toLocaleString()}
              </p>

            </div>

            {/* DESCRIPTION */}
            <p className="mt-3 text-gray-600 text-sm line-clamp-3">
              {data.shortDescription}
            </p>

            {/* ACTION BUTTONS (NEXT STEPS) */}
            <div className="flex gap-3 mt-4">

  {/* TAKE ATTENDANCE BUTTON */}
  <button
    onClick={() => navigate(`/teacher/attendance/${data._id}`)}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
  >
    Take Attendance
  </button>

  {/* VIEW ATTENDANCE BUTTON */}
  <button
    onClick={() => navigate(`/teacher/attendance/view/${data._id}`)}
    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
  >
    View Attendance
  </button>

</div>


          </div>

        ))}

      </div>

    </div>
  );
};

export default AssignedCompetitons;
