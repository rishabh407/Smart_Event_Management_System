import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  updateEvent
} from "../../api/event.api";

const EditEvent = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    venueOverview: "",
    startDate: "",
    endDate: ""
  });

  const [banner, setBanner] = useState(null);
  const [oldBanner, setOldBanner] = useState("");

  // ---------------- FETCH EVENT ----------------
const formatDateTimeLocal = (date) => {

  const d = new Date(date);

  const offset = d.getTimezoneOffset();

  const local = new Date(d.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
};

  const fetchEvent = async () => {
    try {
      const res = await getEventById(id);
     console.log(res.data);
      const event = res.data;

      // Prevent editing started events
      if (event.liveStatus !== "upcoming") {
        alert("You cannot edit ongoing or completed events");
        navigate("/hod/manage-events");
        return;
      }

      setFormData({
        title: event.title,
        shortDescription: event.shortDescription,
        description: event.description,
        venueOverview: event.venueOverview,
  startDate: formatDateTimeLocal(event.startDate),
  endDate: formatDateTimeLocal(event.endDate),      
});

      setOldBanner(event.bannerImage);

    } catch (error) {

      console.error(error);
      alert("Failed to load event");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchEvent();
  }, []);

  // ---------------- INPUT HANDLER ----------------

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return alert("End date must be after start date");
    }

    try {

      const data = new FormData();

      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (banner) {
        data.append("banner", banner);
      }

      await updateEvent(id, data);

      alert("Event updated successfully");

      navigate("/hod/manage-events");

    } catch (error) {

      alert(error.response?.data?.message || "Update failed");

    }

  };

  // ---------------- UI ----------------

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading event...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

      <h1 className="text-2xl font-bold mb-4">
        Edit Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full border p-2 rounded"
          required
        />

        {/* SHORT DESC */}

        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full border p-2 rounded"
          required
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Full Description"
          rows="4"
          className="w-full border p-2 rounded"
          required
        />

        {/* VENUE */}

        <input
          type="text"
          name="venueOverview"
          value={formData.venueOverview}
          onChange={handleChange}
          placeholder="Venue"
          className="w-full border p-2 rounded"
          required
        />

        {/* DATES */}

        <div className="grid grid-cols-2 gap-3">

          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

        </div>

        {/* OLD IMAGE */}

        {oldBanner && (

          <div>
            <p className="text-sm mb-1">Current Banner:</p>

            <img
              src={`http://localhost:5000${oldBanner}`}
              alt="banner"
              className="h-32 rounded border"
            />
          </div>

        )}

        {/* NEW IMAGE */}

        <input
          type="file"
          onChange={(e) => setBanner(e.target.files[0])}
          accept="image/*"
        />

        {/* BUTTON */}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Update Event
        </button>

      </form>

    </div>
  );
};

export default EditEvent;
