import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCompetitionDetails,
  toggleCompetitionRegistration
} from "../../api/competition.api";
import { getCompetitionRegistrationStats } from "../../api/registeration.api";

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

  // ================= STATUS =================

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center text-red-500 mt-10">
        Competition not found
      </div>
    );
  }

  const status = getStatus();
  const isLocked = status !== "UPCOMING";

  return (

    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">

      {/* HEADER */}

      <div className="mb-6">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-3"
        >
          ← Back
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

          <h1 className="text-2xl sm:text-3xl font-bold">
            {competition.name}
          </h1>

          <div className="flex flex-wrap gap-2">

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
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

      {/* ================= STATS ================= */}

      {stats && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatBox label="Registered" value={stats.totalRegistered} color="blue" />

          <StatBox label="Present" value={stats.present} color="green" />

          <StatBox label="Cancelled" value={stats.cancelled} color="red" />

          {stats.maxParticipants && (
            <StatBox label="Slots Left" value={stats.slotsLeft} color="purple" />
          )}

        </div>

      )}

      {/* BASIC INFO */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

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

      <div className="mb-5">

        <h3 className="font-semibold mb-2">
          Description
        </h3>

        <p className="text-gray-700">
          {competition.shortDescription}
        </p>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex flex-wrap gap-3 mt-6">

        <button
          disabled={isLocked}
          onClick={() =>
            navigate(`/coordinator/competitions/edit/${competition._id}`)
          }
          className={`px-4 py-2 rounded ${
            isLocked
              ? "bg-gray-300 text-gray-500"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          ✏️ Edit
        </button>

        <button
          disabled={isLocked}
          onClick={() =>
            navigate(`/coordinator/competitions/${competition._id}/assign-teachers`)
          }
          className={`px-4 py-2 rounded ${
            isLocked
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          👥 Assign Teachers
        </button>

        <button
          onClick={() =>
            navigate(`/coordinator/competitions/${competition._id}/registrations`)
          }
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          📋 View Registrations
        </button>

        <button
          disabled={isLocked || stats?.isFull}
          onClick={handleToggleRegistration}
          className={`px-4 py-2 rounded ${
            isLocked || stats?.isFull
              ? "bg-gray-300 text-gray-500"
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

    <div className={`${colors[color]} p-4 rounded-lg`}>

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
