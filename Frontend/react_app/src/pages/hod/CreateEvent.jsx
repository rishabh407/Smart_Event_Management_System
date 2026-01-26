import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/event.api";

const CreateEvent = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    startDate: "",
    endDate: "",
    venueOverview: "",
    coordinatorId: ""
  });

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- HANDLE INPUT ----------------

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Frontend validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return alert("End Date must be after Start Date");
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("description", formData.description);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("venueOverview", formData.venueOverview);
    data.append("coordinatorId", formData.coordinatorId);

    if (banner) {
      data.append("banner", banner);
    }

    try {

      setLoading(true);

      await createEvent(data);

      alert("Event Created Successfully ✅");

      navigate("/hod/manage-events");

    } catch (error) {

      alert(error.response?.data?.message || "Failed to create event");

    } finally {

      setLoading(false);

    }

  };

  // ---------------- UI ----------------

  return (

    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-6">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* SHORT DESCRIPTION */}

        <input
          type="text"
          name="shortDescription"
          placeholder="Short Description"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
          className="w-full border p-2 rounded"
        />

        {/* DATE TIME */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        {/* VENUE */}
        <input
          type="text"
          name="venueOverview"
          placeholder="Venue"
          value={formData.venueOverview}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* COORDINATOR ID */}

        <input
          type="text"
          name="coordinatorId"
          placeholder="Coordinator User ID"
          value={formData.coordinatorId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* BANNER */}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBanner(e.target.files[0])}
          className="w-full"
        />

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >

          {loading ? "Creating Event..." : "Create Event"}

        </button>

      </form>

    </div>

  );
};
export default CreateEvent;