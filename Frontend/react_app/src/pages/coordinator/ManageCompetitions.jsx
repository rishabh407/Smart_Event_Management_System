import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventCompetitions,
  publishCompetition,
  unpublishCompetition,
  deleteCompetition
} from "../../api/competition.api";
import toast from "react-hot-toast";

const ManageCompetitions = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getEventCompetitions(eventId);
      setCompetitions(res.data || []);
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

  // ================= STATUS LOGIC =================

  const getStatus = (startTime, endTime) => {

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= ACTION HANDLERS =================

  const handlePublish = async (id) => {
    try {
      await publishCompetition(id);
      toast.success("Competition published successfully");
      fetchCompetitions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Publish failed");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await unpublishCompetition(id);
      toast.success("Competition unpublished successfully");
      fetchCompetitions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unpublish failed");
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this competition?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCompetition(id);
      toast.success("Competition deleted successfully");
      fetchCompetitions();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">
            Loading competitions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/coordinator/events")}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
          >
            ← Back to Events
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Event Competitions
          </h1>

          <p className="text-gray-600 text-sm md:text-base mt-1">
            Manage competitions for this event
          </p>

        </div>

        <button
          onClick={() =>
            navigate(`/coordinator/events/${eventId}/competitions/create`)
          }
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow"
        >
          ➕ Create Competition
        </button>

      </div>

      {/* ================= EMPTY STATE ================= */}

      {competitions.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <p className="text-gray-500">
            No competitions created yet
          </p>
        </div>

      )}

      {/* ================= GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {competitions.map((comp) => {

          const status = getStatus(comp.startTime, comp.endTime);
          const isLocked = status !== "UPCOMING";

          return (

            <div
              key={comp._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-5 border flex flex-col"
            >

              {/* TITLE + STATUS */}

              <div className="flex justify-between items-start gap-2 mb-2">

                <h2 className="font-semibold text-base md:text-lg line-clamp-2">
                  {comp.name}
                </h2>

                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                    status === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </span>

              </div>

              {/* META */}

              <div className="text-sm text-gray-600 space-y-1 mb-4">

                <p>📍 {comp.venue}</p>

                <p>
                  🕒 {new Date(comp.startTime).toLocaleString()}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="mt-auto space-y-2">

                <div className="flex gap-2">

                  <button
                    disabled={isLocked}
                    onClick={() =>
                      navigate(`/coordinator/competitions/${comp._id}/assign-teachers`)
                    }
                    className={`flex-1 px-3 py-2 rounded text-sm ${
                      isLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    👥 Assign
                  </button>

                  <button
                    disabled={isLocked}
                    onClick={() =>
                      navigate(`/coordinator/competitions/edit/${comp._id}`)
                    }
                    className={`px-3 py-2 rounded text-sm ${
                      isLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    ✏️ Edit
                  </button>

                </div>

                <button
                  onClick={() =>
                    navigate(`/coordinator/competitions/details/${comp._id}`)
                  }
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded text-sm"
                >
                  👁️ View Details
                </button>

                <button
                  disabled={isLocked}
                  onClick={() => handleDelete(comp._id)}
                  className={`w-full px-3 py-2 rounded text-sm ${
                    isLocked
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  🗑️ Delete
                </button>

                {comp.isPublished ? (

                  <button
                    disabled={isLocked}
                    onClick={() => handleUnpublish(comp._id)}
                    className={`w-full px-3 py-2 rounded text-sm ${
                      isLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    👁️ Unpublish
                  </button>

                ) : (

                  <button
                    onClick={() => handlePublish(comp._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    📢 Publish
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

export default ManageCompetitions;
