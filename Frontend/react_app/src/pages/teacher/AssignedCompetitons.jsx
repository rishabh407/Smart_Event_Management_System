import React, { useEffect, useState, useCallback } from "react";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { useNavigate } from "react-router-dom";

const AssignedCompetitons = () => {

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // ================= FETCH DATA =================

  const fetchAssigned = useCallback(async () => {
    try {
      const res = await getinchargeteacherscompetitions();
      setCompetitions(res.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  // ================= LIVE CLOCK (EVERY SECOND) =================

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // ================= STATUS LOGIC =================

  const getCompetitionStatus = (startTime, endTime) => {

    const now = currentTime;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= NORMAL COUNTDOWN =================

  const getCountdown = (startTime, endTime) => {

    const now = currentTime;
    const start = new Date(startTime);
    const end = new Date(endTime);

    let diff;

    if (now < start) diff = start - now;
    else if (now <= end) diff = end - now;
    else return "Finished";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  };

  // ================= LAST 5 MIN ALERT TIMER =================

  const getLast5MinTimer = (targetTime) => {

    if (!targetTime) return null;

    const now = currentTime;
    const target = new Date(targetTime);

    const diff = target - now;

    if (diff > 0 && diff <= 5 * 60 * 1000) {

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff / 1000) % 60);

      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return null;
  };

  // ================= UI =================

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        My Assigned Competitions
      </h1>

      {/* LOADING STATE */}
      {loading && (
        <p className="text-gray-500">Loading competitions...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && competitions.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No competitions assigned yet.
          </p>
        </div>
      )}

      {/* COMPETITION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {competitions.map((data) => {

          const status = getCompetitionStatus(
            data.startTime,
            data.endTime
          );

          const countdown = getCountdown(
            data.startTime,
            data.endTime
          );

          const registerAlert = getLast5MinTimer(data.registrationDeadline);
          const startAlert = getLast5MinTimer(data.startTime);
          const endAlert = getLast5MinTimer(data.endTime);

          return (

            <div
              key={data._id}
              className={`bg-white rounded-lg shadow transition p-5 border
                ${status === "ONGOING"
                  ? "border-green-500 animate-pulse"
                  : "hover:shadow-lg"}
              `}
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">

                <h2 className="text-lg font-bold">
                  {data.name}
                </h2>

                <span
                  className={`px-3 py-1 text-sm rounded-full 
                  ${status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"}
                  `}
                >
                  {status}
                </span>

              </div>

              {/* SMART ALERTS */}

              {registerAlert && (
                <p className="text-sm font-bold text-red-600 animate-pulse">
                  ⏳ Registration closes in: {registerAlert}
                </p>
              )}

              {startAlert && status === "UPCOMING" && (
                <p className="text-sm font-bold text-orange-600 animate-pulse">
                  ▶️ Competition starts in: {startAlert}
                </p>
              )}

              {endAlert && status === "ONGOING" && (
                <p className="text-sm font-bold text-purple-600 animate-pulse">
                  ⏹ Competition ends in: {endAlert}
                </p>
              )}

              {/* NORMAL COUNTDOWN */}

              <p className="text-sm font-semibold mb-2 text-indigo-600">

                {status === "UPCOMING" && `Starts in: ${countdown}`}
                {status === "ONGOING" && `Ends in: ${countdown}`}
                {status === "COMPLETED" && "Competition Finished"}

              </p>

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

              </div>

              {/* DESCRIPTION */}

              <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                {data.shortDescription}
              </p>

              {/* ACTION BUTTONS */}

              <div className="flex flex-wrap gap-3 mt-4">

                <button
                  disabled={status !== "ONGOING"}
                  onClick={() =>
                    navigate(`/teacher/attendance/${data._id}`)
                  }
                  className={`px-4 py-2 rounded text-sm text-white
                    ${status !== "ONGOING"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"}
                  `}
                >
                  Take Attendance
                </button>

                {/* <button
                  onClick={() =>
                    navigate(`/teacher/attendance/view/${data._id}`)
                  }
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
                >
                  View Attendance
                </button> */}

<button
  disabled={status === "UPCOMING"}
  onClick={() =>
    navigate(`/teacher/attendance/view/${data._id}`)
  }
  className={`px-4 py-2 rounded text-sm
    ${
      status === "UPCOMING"
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300"
    }
  `}
>
  View Attendance
</button>


                <button
                  onClick={() =>
                    navigate(`/teacher/registrations/${data._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  View Registrations
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
