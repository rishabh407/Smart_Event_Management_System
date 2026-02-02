import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  updateEvent
} from "../../api/event.api";
import toast from "react-hot-toast";

const EditEvent = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    venueOverview: "",
    startDate: "",
    endDate: ""
  });

  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [oldBanner, setOldBanner] = useState("");

  // ---------------- FORMAT DATE TIME LOCAL ----------------
  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // ---------------- FETCH EVENT ----------------
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await getEventById(id);
      const event = res.data;

      // Prevent editing started events
      if (event.liveStatus !== "upcoming") {
        toast.error("You cannot edit ongoing or completed events");
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

      setOldBanner(event.bannerImage || "");

    } catch (error) {
      console.error(error);
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview("");
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (banner) {
        data.append("banner", banner);
      }

      await toast.promise(
        updateEvent(id, data),
        {
          loading: 'Updating event...',
          success: 'Event updated successfully ✅',
          error: (err) => err.response?.data?.message || 'Update failed',
        }
      );

      navigate("/hod/manage-events");
    } catch (error) {
      // Error handled by toast
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading event...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">

      <h1 className="text-2xl sm:text-3xl font-bold mb-7 text-gray-800 text-center">
        Edit Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Annual Tech Fest"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* SHORT DESCRIPTION */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="A brief overview of the event"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Full Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of the event"
            rows="4"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* VENUE */}
        <div>
          <label htmlFor="venueOverview" className="block text-sm font-medium text-gray-700 mb-2">
            Venue Overview
          </label>
          <input
            type="text"
            id="venueOverview"
            name="venueOverview"
            value={formData.venueOverview}
            onChange={handleChange}
            placeholder="e.g., Auditorium, Main Hall"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* CURRENT BANNER */}
        {oldBanner && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Banner
            </label>
            <img
              src={`http://localhost:5000${oldBanner}`}
              alt="Current banner"
              className="w-full sm:w-auto max-h-40 rounded-md border border-gray-300 object-cover"
            />
          </div>
        )}

        {/* NEW BANNER */}
        <div>
          <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-2">
            {oldBanner ? "Update Banner (Optional)" : "Event Banner (Optional)"}
          </label>
          <input
            type="file"
            id="banner"
            onChange={handleBannerChange}
            accept="image/*"
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {bannerPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">New Banner Preview:</p>
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full sm:max-w-xs h-auto rounded-md shadow border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-4 rounded-md text-white font-semibold shadow-md transition-colors duration-200
            ${submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {submitting ? "Updating Event..." : "Update Event"}
        </button>

      </form>

    </div>
  );
};

export default EditEvent;
