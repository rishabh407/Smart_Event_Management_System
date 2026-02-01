// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import {
//  getCompetitionDetails,
//  toggleCompetitionRegistration
// } from "../../api/competition.api";

// import {
//  getCompetitionRegistrationStats
// } from "../../api/registeration.api";

// const CompetitionDetails = () => {

//  const { id } = useParams();
//  const navigate = useNavigate();

//  const [competition, setCompetition] = useState(null);
//  const [stats, setStats] = useState(null);
//  const [loading, setLoading] = useState(true);

//  // ==========================
//  // FETCH DATA
//  // ==========================

//  const fetchDetails = async () => {

//   try {
//  console.log(id);
//    const compRes = await getCompetitionDetails(id);
//    const statsRes = await getCompetitionRegistrationStats(id);
//    setCompetition(compRes.data.data);
//    setStats(statsRes.data);
//    setLoading(false);
//   } catch (error) {
//    console.error(error);
//    setLoading(false);
//   }
//  };

//  useEffect(() => {
//   fetchDetails();
//  }, [id]);

//  // ==========================
//  // TOGGLE REGISTRATION
//  // ==========================

//  const handleToggleRegistration = async () => {

//   try {

//    const res = await toggleCompetitionRegistration(competition._id);

//    setCompetition(prev => ({
//     ...prev,
//     registrationOpen: res.data.registrationOpen
//    }));

//   } catch (error) {

//    console.error(error);
//    alert("Failed to update registration status");

//   }

//  };

//  // ==========================
//  // UI STATES
//  // ==========================

//  if (loading) return <p>Loading...</p>;

//  if (!competition) return <p>Competition not found</p>;

//  // ==========================
//  // UI
//  // ==========================

//   return (

//   <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-xl">

//    {/* HEADER */}
//    <div className="mb-6">
//      <button
//        onClick={() => navigate(-1)}
//        className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
//      >
//        ← Back
//      </button>
//      <div className="flex justify-between items-center">
//        <h1 className="text-3xl font-bold text-gray-800">
//          {competition.name}
//        </h1>
//        <div className="flex gap-3">
//          <span
//            className={`px-4 py-2 rounded-full text-sm font-semibold ${
//              competition.isPublished
//                ? "bg-green-100 text-green-700"
//                : "bg-red-100 text-red-700"
//            }`}
//          >
//            {competition.isPublished ? "Published" : "Draft"}
//          </span>
//          <span
//            className={`px-4 py-2 rounded-full text-sm font-semibold ${
//              competition.registrationOpen
//                ? "bg-blue-100 text-blue-700"
//                : "bg-gray-200 text-gray-700"
//            }`}
//          >
//            {competition.registrationOpen
//              ? "Registration Open"
//              : "Registration Closed"}
//          </span>
//        </div>
//      </div>
//    </div>

//    {/* REGISTRATION STATS */}

//    {stats && (

//     <div className="mb-6">

//      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//       <div className="bg-blue-100 p-4 rounded">
//        <p className="text-sm text-gray-600">Registered</p>
//        <h2 className="text-xl font-bold">{stats.active}</h2>
//       </div>

//       <div className="bg-green-100 p-4 rounded">
//        <p className="text-sm text-gray-600">Total Entries</p>
//        <h2 className="text-xl font-bold">{stats.total}</h2>
//       </div>

//       <div className="bg-red-100 p-4 rounded">
//        <p className="text-sm text-gray-600">Cancelled</p>
//        <h2 className="text-xl font-bold">{stats.cancelled}</h2>
//       </div>

//       {stats.maxParticipants && (

//        <div className="bg-purple-100 p-4 rounded">
//         <p className="text-sm text-gray-600">Slots Left</p>
//         <h2 className="text-xl font-bold">{stats.slotsLeft}</h2>
//        </div>

//       )}

//      </div>

//      {/* CAPACITY BAR */}

//      {stats.maxParticipants && (

//       <div className="mt-4">

//        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">

//         <div
//          className="bg-green-500 h-3 transition-all"
//          style={{
//           width: `${(stats.active / stats.maxParticipants) * 100}%`
//          }}
//         />

//        </div>

//        <p className="text-sm text-gray-600 mt-1">
//         Capacity Used: {stats.active}/{stats.maxParticipants}
//        </p>

//       </div>

//      )}

//     </div>

//    )}

//    {/* BASIC INFO */}

//    <div className="grid grid-cols-2 gap-4 mb-4">

//     <p><b>Type:</b> {competition.type}</p>
//     <p><b>Venue:</b> {competition.venue}</p>

//     <p>
//      <b>Registration Deadline:</b>{" "}
//      {new Date(competition.registrationDeadline).toLocaleString()}
//     </p>

//     <p>
//      <b>Start Time:</b>{" "}
//      {new Date(competition.startTime).toLocaleString()}
//     </p>

//     <p>
//      <b>End Time:</b>{" "}
//      {new Date(competition.endTime).toLocaleString()}
//     </p>

//    </div>

//    {/* DESCRIPTION */}

//    <div className="mb-4">

//     <h3 className="font-semibold mb-1">
//      Description
//     </h3>

//     <p className="text-gray-700">
//      {competition.shortDescription}
//     </p>

//    </div>

//    {/* ASSIGNED TEACHERS */}

//    <div className="mb-4">

//     <h3 className="font-semibold mb-2">
//      Assigned Teachers
//     </h3>

//     {competition.assignedTeachers?.length === 0 && (
//      <p className="text-gray-500">No teachers assigned</p>
//     )}

//     {competition.assignedTeachers?.map(item => (

//      <div
//       key={item.teacher._id}
//       className="border p-2 rounded mb-2"
//      >

//       <p>
//        {item.teacher.fullName} —{" "}
//        <span className="text-sm text-gray-600">
//         {item.role}
//        </span>
//       </p>

//      </div>

//     ))}

//    </div>

//    {/* ACTION BUTTONS */}
//    <div className="flex flex-wrap gap-3 mt-6">
//      <button
//        onClick={() =>
//          navigate(`/coordinator/competitions/edit/${competition._id}`)
//        }
//        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md"
//      >
//        ✏️ Edit Competition
//      </button>
//      <button
//        onClick={() =>
//          navigate(`/coordinator/competitions/${competition._id}/assign-teachers`)
//        }
//        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md"
//      >
//        👥 Assign Teachers
//      </button>
//      <button
//        onClick={() =>
//          navigate(`/coordinator/competitions/${competition._id}/registrations`)
//        }
//        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md"
//      >
//        📋 View Registrations
//      </button>
//      <button
//        disabled={stats?.isFull}
//        onClick={handleToggleRegistration}
//        className={`px-5 py-2 rounded-md text-white font-semibold transition-colors duration-200 shadow-md ${
//          stats?.isFull
//            ? "bg-gray-400 cursor-not-allowed"
//            : competition.registrationOpen
//              ? "bg-red-600 hover:bg-red-700"
//              : "bg-green-600 hover:bg-green-700"
//        }`}
//      >
//        {stats?.isFull
//          ? "Registration Full"
//          : competition.registrationOpen
//            ? "🔒 Close Registration"
//            : "🔓 Open Registration"}
//      </button>
//    </div>

//   </div>

//  );

// };

// export default CompetitionDetails;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCompetitionDetails,
  toggleCompetitionRegistration
} from "../../api/competition.api";

import {
  getCompetitionRegistrationStats
} from "../../api/registeration.api";

const CompetitionDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================

  const fetchDetails = async () => {

    try {

      const compRes = await getCompetitionDetails(id);
      const statsRes = await getCompetitionRegistrationStats(id);

      setCompetition(compRes.data.data);
      setStats(statsRes.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // ================= STATUS LOGIC =================

  const getStatus = () => {

    const now = new Date();
    const start = new Date(competition.startTime);
    const end = new Date(competition.endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= TOGGLE REGISTRATION =================

  const handleToggleRegistration = async () => {

    try {

      const res = await toggleCompetitionRegistration(competition._id);

      setCompetition(prev => ({
        ...prev,
        registrationOpen: res.data.registrationOpen
      }));

    } catch (error) {

      alert("Failed to update registration");

    }
  };

  // ================= UI STATES =================

  if (loading) return <p>Loading...</p>;

  if (!competition) return <p>Competition not found</p>;

  const status = getStatus();

  const isLocked = status !== "UPCOMING";

  // ================= UI =================

  return (

    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-xl">

      {/* HEADER */}

      <div className="mb-6">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back
        </button>

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            {competition.name}
          </h1>

          <div className="flex gap-3">

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === "UPCOMING"
                  ? "bg-blue-100 text-blue-700"
                  : status === "ONGOING"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                competition.registrationOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {competition.registrationOpen
                ? "Registration Open"
                : "Registration Closed"}
            </span>

          </div>

        </div>

      </div>

      {/* STATS */}

      {stats && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatBox label="Active" value={stats.active} color="blue" />
          <StatBox label="Total" value={stats.total} color="green" />
          <StatBox label="Cancelled" value={stats.cancelled} color="red" />

          {stats.maxParticipants && (
            <StatBox label="Slots Left" value={stats.slotsLeft} color="purple" />
          )}

        </div>

      )}

      {/* BASIC INFO */}

      <div className="grid grid-cols-2 gap-3 mb-4">

        <p><b>Type:</b> {competition.type}</p>
        <p><b>Venue:</b> {competition.venue}</p>

        <p>
          <b>Registration Deadline:</b>{" "}
          {new Date(competition.registrationDeadline).toLocaleString()}
        </p>

        <p>
          <b>Start:</b>{" "}
          {new Date(competition.startTime).toLocaleString()}
        </p>

        <p>
          <b>End:</b>{" "}
          {new Date(competition.endTime).toLocaleString()}
        </p>

      </div>

      {/* DESCRIPTION */}

      <div className="mb-4">

        <h3 className="font-semibold mb-1">
          Description
        </h3>

        <p className="text-gray-700">
          {competition.shortDescription}
        </p>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex flex-wrap gap-3 mt-6">

        {/* EDIT */}

        <button
          disabled={isLocked}
          onClick={() =>
            navigate(`/coordinator/competitions/edit/${competition._id}`)
          }
          className={`px-4 py-2 rounded ${
            isLocked
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          ✏️ Edit
        </button>

        {/* ASSIGN */}

        <button
          disabled={isLocked}
          onClick={() =>
            navigate(`/coordinator/competitions/${competition._id}/assign-teachers`)
          }
          className={`px-4 py-2 rounded ${
            isLocked
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          👥 Assign Teachers
        </button>

        {/* VIEW REGISTRATIONS */}

        <button
          onClick={() =>
            navigate(`/coordinator/competitions/${competition._id}/registrations`)
          }
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          📋 View Registrations
        </button>

        {/* TOGGLE REGISTRATION */}

        <button
          disabled={isLocked || stats?.isFull}
          onClick={handleToggleRegistration}
          className={`px-4 py-2 rounded ${
            isLocked || stats?.isFull
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : competition.registrationOpen
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {stats?.isFull
            ? "Registration Full"
            : competition.registrationOpen
            ? "🔒 Close Registration"
            : "🔓 Open Registration"}
        </button>

      </div>

    </div>

  );
};

// ================= STAT BOX =================

const StatBox = ({ label, value, color }) => {

  const colors = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    red: "bg-red-100",
    purple: "bg-purple-100"
  };

  return (

    <div className={`${colors[color]} p-4 rounded`}>

      <p className="text-sm text-gray-600">
        {label}
      </p>

      <h2 className="text-xl font-bold">
        {value}
      </h2>

    </div>

  );
};

export default CompetitionDetails;
