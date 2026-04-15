import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { useNavigate, useParams } from "react-router-dom";

const AssignedCompetitons = () => {

  const navigate = useNavigate();
 const { id } = useParams();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


  const fetchAssigned = useCallback(async () => {

    try {
      const res = await getinchargeteacherscompetitions(id);
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


  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

 
  const getCompetitionStatus = (startTime, endTime) => {

    const now = currentTime;

    if (now < new Date(startTime)) return "UPCOMING";
    if (now <= new Date(endTime)) return "ONGOING";

    return "COMPLETED";
  };


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

 
  return (
    <div className="p-4 md:p-6">


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


      <input
        type="text"
        placeholder="🔍 Search competition..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />


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

      {loading && (
        <p className="text-gray-500">
          Loading competitions...
        </p>
      )}


      {!loading && filteredCompetitions.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No competitions found.
          </p>
        </div>
      )}


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


              <p className="text-sm text-gray-600 mb-2">
                👥 {data.totalRegistrations || 0} Registered
              </p>


              <p className="text-indigo-600 text-sm font-semibold mb-2">

                {status === "UPCOMING" && `Starts in: ${countdown}`}
                {status === "ONGOING" && `Ends in: ${countdown}`}
                {status === "COMPLETED" && "Competition Finished"}

              </p>


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
