import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  cancelRegistration,
  deleteRegistration,
  getMyRegistrations
} from "../../api/registeration.api";
import toast from "react-hot-toast";

const MyRegistrations = () => {

  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ================= COMP STATUS =================

  const getCompetitionStatus = (startTime, endTime) => {

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= FETCH =================

  const fetchRegistrations = async () => {
    try {

      setLoading(true);

      const res = await getMyRegistrations();
      setRegistrations(res.data?.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load registrations");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // ================= CANCEL =================

  const handleCancel = async (registrationId) => {

    if (!window.confirm("Are you sure you want to cancel this registration?")) return;

    try {

      setCancelLoadingId(registrationId);

      await cancelRegistration(registrationId);

      toast.success("Registration cancelled successfully");

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId
            ? { ...reg, status: "cancelled" }
            : reg
        )
      );

    } catch (error) {

      toast.error(error.response?.data?.message || "Cancel failed");

    } finally {

      setCancelLoadingId(null);

    }
  };

  // ================= DELETE =================

  const handleDelete = async (registrationId) => {

    if (!window.confirm("This will permanently delete this record. Continue?")) return;

    try {

      setDeleteLoadingId(registrationId);

      await deleteRegistration(registrationId);

      toast.success("Registration deleted successfully");

      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId)
      );

    } catch (error) {

      toast.error(error.response?.data?.message || "Delete failed");

    } finally {

      setDeleteLoadingId(null);

    }
  };

  // ================= SEARCH + FILTER =================

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {

      const nameMatch =
        reg.competition?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        filter === "all" || reg.status === filter;

      return nameMatch && statusMatch;

    });
  }, [registrations, search, filter]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Registrations
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Manage your competition registrations
        </p>
      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Search competitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2">

          <FilterBtn label="All" value="all" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Registered" value="registered" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Attended" value="attended" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Cancelled" value="cancelled" filter={filter} setFilter={setFilter} />

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {filteredRegistrations.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-10 text-center">

          <div className="text-5xl mb-3">📋</div>

          <p className="text-gray-500 text-lg mb-2">
            No registrations found
          </p>

          <button
            onClick={() => navigate("/student/events")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Browse Events
          </button>

        </div>

      )}

      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredRegistrations.map((reg) => {

          const competitionStatus = getCompetitionStatus(
            reg.competition?.startTime,
            reg.competition?.endTime
          );

          const canScan =
            reg.status === "registered" &&
            competitionStatus === "ONGOING";

          return (

            <div
              key={reg._id}
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 border flex flex-col"
            >

              {/* DELETE */}

              {reg.status === "cancelled" && (

                <button
                  onClick={() => handleDelete(reg._id)}
                  disabled={deleteLoadingId === reg._id}
                  className={`absolute top-3 right-3 ${
                    deleteLoadingId === reg._id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-red-600"
                  }`}
                >
                  🗑️
                </button>

              )}

              {/* TITLE */}

              <h2 className="font-semibold text-base sm:text-lg mb-2 pr-8">
                {reg.competition?.name || "Competition"}
              </h2>

              {/* DETAILS */}

              <div className="text-sm text-gray-600 space-y-1 mb-3">

                <p><strong>Venue:</strong> {reg.competition?.venue}</p>

                {reg.team && (
                  <p><strong>Team:</strong> {reg.team.teamName}</p>
                )}

                <p>
                  <strong>Registered:</strong>{" "}
                  {new Date(reg.createdAt).toLocaleDateString()}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="font-medium">
                    {competitionStatus}
                  </span>
                </p>

              </div>

              {/* REG STATUS */}

              <div className="mb-3">

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${reg.status === "registered"
                      ? "bg-green-100 text-green-700"
                      : reg.status === "attended"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"}
                  `}
                >
                  {reg.status === "registered" && "✅ Registered"}
                  {reg.status === "attended" && "✓ Attended"}
                  {reg.status === "cancelled" && "❌ Cancelled"}
                </span>

              </div>

              {/* ACTIONS */}

              <div className="space-y-2 mt-auto">

                {reg.status === "attended" ? (

                  <div className="text-center py-2 text-green-700 font-medium">
                    ✅ Attendance Marked
                  </div>

                ) : (

                  reg.status === "registered" && (

                    <button
                      disabled={!canScan}
                      onClick={() => navigate("/student/scan")}
                      className={`w-full py-2 rounded-lg font-medium transition
                        ${canScan
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"}
                      `}
                    >
                      {competitionStatus === "UPCOMING" && "⏳ Attendance Not Started"}
                      {competitionStatus === "ONGOING" && "📷 Scan Attendance QR"}
                      {competitionStatus === "COMPLETED" && "❌ Attendance Closed"}
                    </button>

                  )

                )}

                {reg.status === "registered" && (

                  <button
                    onClick={() => handleCancel(reg._id)}
                    disabled={cancelLoadingId === reg._id}
                    className={`w-full py-2 rounded-lg font-medium transition
                      ${cancelLoadingId === reg._id
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"}
                    `}
                  >
                    {cancelLoadingId === reg._id
                      ? "Cancelling..."
                      : "Cancel Registration"}
                  </button>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

// ================= FILTER BUTTON =================

const FilterBtn = ({ label, value, filter, setFilter }) => (
  <button
    onClick={() => setFilter(value)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${filter === value
        ? "bg-blue-600 text-white"
        : "bg-gray-100 hover:bg-gray-200"}
    `}
  >
    {label}
  </button>
);

export default MyRegistrations;
