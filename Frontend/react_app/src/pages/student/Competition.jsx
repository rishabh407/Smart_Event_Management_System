import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionsByEvent } from "../../api/competition.api";

const Competitions = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ---------------- FETCH COMPETITIONS ----------------

  const fetchCompetitions = async () => {
    try {
      const res = await getCompetitionsByEvent(eventId);
      setCompetitions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TIMER UPDATE ----------------

  useEffect(() => {

    fetchCompetitions();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, [eventId]);

  // ---------------- STATUS LOGIC ----------------

  const getCompetitionStatus = (comp) => {

    const now = currentTime;

    const regDeadline = new Date(comp.registrationDeadline);
    const start = new Date(comp.startTime);
    const end = new Date(comp.endTime);

    if (now < regDeadline) return "REG_OPEN";
    if (now >= regDeadline && now < start) return "REG_CLOSED";
    if (now >= start && now <= end) return "LIVE";

    return "FINISHED";
  };

  // ---------------- COUNTDOWN LOGIC ----------------

  const getTimeRemaining = (targetDate) => {

    const diff = new Date(targetDate) - currentTime;

    if (diff <= 0) return "00h 00m 00s";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ---------------- UI ----------------

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading competitions...
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Competitions
      </h1>

      {competitions.length === 0 && (
        <p className="text-gray-500">
          No competitions available
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {competitions.map((comp) => {

          const status = getCompetitionStatus(comp);

          return (

            <div
              key={comp._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >

              {/* TITLE */}

              <h2 className="text-lg font-semibold">
                {comp.name}
              </h2>

              {/* DESCRIPTION */}

              <p className="text-sm text-gray-600">
                {comp.shortDescription}
              </p>

              {/* DETAILS */}

              <div className="mt-2 text-sm text-gray-500 space-y-1">

                <p>📌 Type: {comp.type}</p>
                <p>📍 Venue: {comp.venue}</p>

                <p>
                  🗓 Starts:
                  {" "}
                  {new Date(comp.startTime).toLocaleString()}
                </p>

                <p>
                  ⏳ Registration Ends:
                  {" "}
                  {new Date(comp.registrationDeadline).toLocaleString()}
                </p>

              </div>

              {/* STATUS BADGE */}

              <div className="mt-2">

                {status === "REG_OPEN" && (
                  <span className="text-green-600 font-semibold">
                    🟢 Registration Open
                  </span>
                )}

                {status === "REG_CLOSED" && (
                  <span className="text-orange-600 font-semibold">
                    🟡 Registration Closed
                  </span>
                )}

                {status === "LIVE" && (
                  <span className="text-blue-600 font-semibold">
                    🔵 Live Now
                  </span>
                )}

                {status === "FINISHED" && (
                  <span className="text-red-600 font-semibold">
                    🔴 Finished
                  </span>
                )}

              </div>

              {/* COUNTDOWN TIMER */}

              {status === "REG_OPEN" && (
                <p className="text-xs text-gray-500 mt-1">
                  Registration Ends In:
                  {" "}
                  {getTimeRemaining(comp.registrationDeadline)}
                </p>
              )}

              {status === "REG_CLOSED" && (
                <p className="text-xs text-gray-500 mt-1">
                  Competition Starts In:
                  {" "}
                  {getTimeRemaining(comp.startTime)}
                </p>
              )}
              <button
  disabled={status !== "REG_OPEN"}
  onClick={() =>
    navigate(`/student/events/${eventId}/competitions/${comp._id}/register`)
  }
  className={`mt-4 w-full py-2 rounded text-white transition
    ${
      status === "REG_OPEN"
        ? "bg-green-600 hover:bg-green-700"
        : status === "LIVE"
        ? "bg-blue-500 cursor-not-allowed"
        : status === "FINISHED"
        ? "bg-red-400 cursor-not-allowed"
        : "bg-gray-400 cursor-not-allowed"
    }
  `}
>
  {status === "REG_OPEN" && "Register Now"}
  {status === "REG_CLOSED" && "Registration Closed"}
  {status === "LIVE" && "Competition Running"}
  {status === "FINISHED" && "Competition Finished"}
</button>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Competitions;
