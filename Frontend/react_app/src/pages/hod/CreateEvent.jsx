import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getDepartmentCoordinators } from "../../api/event.api";
import toast from "react-hot-toast";

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
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coordinators, setCoordinators] = useState([]);
  const [errors, setErrors] = useState({});

  const [coordinatorsLoading, setCoordinatorsLoading] = useState(true);

  // Fetch coordinators
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        setCoordinatorsLoading(true);
        const res = await getDepartmentCoordinators();
        setCoordinators(res.data || []);
        if (res.data && res.data.length === 0) {
          toast.error("No coordinators available in your department. Please create a coordinator first.");
        }
      } catch (error) {
        console.error("Error fetching coordinators:", error);
        toast.error(error.response?.data?.message || "Failed to load coordinators");
        setCoordinators([]);
      } finally {
        setCoordinatorsLoading(false);
      }
    };
    fetchCoordinators();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.coordinatorId) {
      newErrors.coordinatorId = "Please select a coordinator";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
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
      toast.success("Event created successfully!");
      navigate("/hod/manage-events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-1">Fill in the details to create a new event</p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              placeholder="Brief description (will be shown in cards)"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Detailed event description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Date Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Overview <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="venueOverview"
              placeholder="Event venue location"
              value={formData.venueOverview}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Coordinator <span className="text-red-500">*</span>
            </label>
            {coordinatorsLoading ? (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Loading coordinators...</span>
                </div>
              </div>
            ) : (
              <>
                <select
                  name="coordinatorId"
                  value={formData.coordinatorId}
                  onChange={handleChange}
                  required
                  disabled={coordinators.length === 0}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.coordinatorId 
                      ? "border-red-500" 
                      : coordinators.length === 0
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {coordinators.length === 0 
                      ? "-- No Coordinators Available --" 
                      : "-- Select Coordinator --"}
                  </option>
                  {coordinators.map((coordinator) => (
                    <option key={coordinator._id} value={coordinator._id}>
                      {coordinator.fullName} {coordinator.email ? `(${coordinator.email})` : ""}
                    </option>
                  ))}
                </select>
                {coordinators.length === 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>No coordinators available</strong> in your department. 
                      Please create a coordinator account first before creating events.
                    </p>
                  </div>
                )}
                {coordinators.length > 0 && coordinators.length === 1 && (
                  <p className="mt-1 text-sm text-blue-600">
                    ℹ️ Only {coordinators[0].fullName} is available in your department
                  </p>
                )}
                {errors.coordinatorId && (
                  <p className="mt-1 text-sm text-red-600">{errors.coordinatorId}</p>
                )}
              </>
            )}
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {bannerPreview && (
              <div className="mt-4">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Recommended size: 1200x400px. Max size: 5MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || coordinatorsLoading || coordinators.length === 0}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                loading || coordinatorsLoading || coordinators.length === 0
                  ? "opacity-50 cursor-not-allowed" 
                  : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Event...
                </span>
              ) : coordinators.length === 0 ? (
                "No Coordinators Available"
              ) : (
                "Create Event"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/hod/manage-events")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
