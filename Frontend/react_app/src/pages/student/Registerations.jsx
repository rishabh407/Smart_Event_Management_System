import { useEffect, useState } from "react";
import {
  cancelRegistration,
  deleteRegistration,
  getMyRegistrations
} from "../../api/registeration.api";

const MyRegistrations = () => {

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ---------------- FETCH REGISTRATIONS ----------------

  useEffect(() => {

    const fetchRegistrations = async () => {
      try {
        const res = await getMyRegistrations();
        setRegistrations(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();

  }, []);

  // ---------------- CANCEL HANDLER ----------------

  const handleCancel = async (registrationId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {

      setCancelLoadingId(registrationId);

      await cancelRegistration(registrationId);

      // Update UI instantly
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId
            ? { ...reg, status: "cancelled" }
            : reg
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    } finally {
      setCancelLoadingId(null);
    }
  };

  // ---------------- DELETE HANDLER ----------------

  const handleDelete = async (registrationId) => {

    const confirmDelete = window.confirm(
      "This will permanently delete this record. Continue?"
    );

    if (!confirmDelete) return;
    try {
      setDeleteLoadingId(registrationId);
      await deleteRegistration(registrationId);
      // Remove from UI
      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId)
      );

    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }

  };

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading registrations...
      </p>
    );
  }

  // ---------------- UI ----------------

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        My Registrations
      </h1>

      {registrations.length === 0 && (
        <p className="text-gray-500">
          No registrations yet
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {registrations.map((reg) => (

          <div
            key={reg._id}
            className="relative border p-4 rounded shadow-sm bg-white"
          >

            {/* TOP RIGHT DELETE ICON */}

            {reg.status === "cancelled" && (

              <button
                onClick={() => handleDelete(reg._id)}
                disabled={deleteLoadingId === reg._id}
                title="Delete Registration"
                className={`absolute top-2 right-2 text-gray-500 hover:text-red-600 hover:scale-110 transition
                  ${deleteLoadingId === reg._id && "opacity-50 cursor-not-allowed"}
                `}
              >
                🗑️
              </button>

            )}

            {/* COMPETITION NAME */}

            <h2 className="font-semibold text-lg">
              {reg.competition?.name}
            </h2>

            {/* VENUE */}

            <p className="text-sm text-gray-600">
              Venue: {reg.competition?.venue}
            </p>

            {/* TEAM NAME */}

            {reg.team && (
              <p className="text-xs text-gray-500">
                Team: {reg.team.teamName}
              </p>
            )}

            {/* STATUS */}

            <p className="text-sm mt-1">
              Status:
              <span
                className={`ml-1 font-medium ${
                  reg.status === "registered"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {reg.status}
              </span>
            </p>

            {/* DATE */}

            <p className="text-xs text-gray-400 mt-1">
              Registered On:{" "}
              {new Date(reg.createdAt).toLocaleDateString()}
            </p>

            {/* QR CODE */}

            {reg.qrCode && (
              <img
                src={reg.qrCode}
                alt="QR Code"
                className="mt-3 w-32 border rounded"
              />
            )}

            {/* CANCEL BUTTON */}

            {reg.status === "registered" && (

              <button
                onClick={() => handleCancel(reg._id)}
                disabled={cancelLoadingId === reg._id}
                className={`mt-4 px-3 py-1 text-sm rounded text-white transition
                  ${
                    cancelLoadingId === reg._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >

                {cancelLoadingId === reg._id
                  ? "Cancelling..."
                  : "Cancel Registration"}

              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyRegistrations;
