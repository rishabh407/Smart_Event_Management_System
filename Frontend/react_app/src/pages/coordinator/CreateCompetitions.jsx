import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCompetition } from "../../api/competition.api";
import toast from "react-hot-toast";
import { getEventById } from "../../api/event.api";

const CreateCompetitions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventTime, setEventTime] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    venue: "",
    type: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    maxParticipants: "",
    registrationDeadline: "",
    startTime: "",
    endTime: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ================= FETCH EVENT TIME =================

  useEffect(() => {

    const fetchEventTime = async () => {
      try {
        const res = await getEventById(eventId);
        // console.log(res.data);
        setEventTime(res.data);
      } catch (err) {
        toast.error("Failed to load event timing");
        console.error(err.message);
      }
    };

    fetchEventTime();

  }, [eventId]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Competition name is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }

    if (formData.type === "team") {
      if (!formData.minTeamSize || !formData.maxTeamSize) {
        newErrors.teamSize = "Team size is required";
      } else if (parseInt(formData.minTeamSize) > parseInt(formData.maxTeamSize)) {
        newErrors.teamSize = "Min team size cannot be greater than max team size";
      }
    }

    if (formData.registrationDeadline && formData.startTime) {
      if (new Date(formData.registrationDeadline) >= new Date(formData.startTime)) {
        newErrors.registrationDeadline = "Registration deadline must be before start time";
      }
    }

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (eventTime) {

      const eventStart = new Date(eventTime.startDate);
      const eventEnd = new Date(eventTime.endDate);

      if (
        new Date(formData.startTime) < eventStart ||
        new Date(formData.endTime) > eventEnd
      ) {
        newErrors.timeRange =
          "Competition time must be inside event duration";
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

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        eventId
      };

      await createCompetition(payload);
      toast.success("Competition created successfully!");
      navigate(`/coordinator/events/${eventId}/competitions`);
    } catch (error) {
      console.error("Error creating competition:", error);
      toast.error(error.response?.data?.message || "Error creating competition");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Competition</h1>
        <p className="text-gray-600 mt-1">Add a new competition to this event</p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Competition Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter competition name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDescription"
              placeholder="Brief description of the competition"
              required
              value={formData.shortDescription}
              onChange={handleChange}
              rows="3"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
            )}
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="venue"
              placeholder="Competition venue"
              required
              value={formData.venue}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
            )}
          </div>

          {/* Competition Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>

          {/* Team Fields */}
          {formData.type === "team" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="minTeamSize"
                    placeholder="Min Team Size"
                    min="1"
                    value={formData.minTeamSize}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.teamSize ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="maxTeamSize"
                    placeholder="Max Team Size"
                    min="1"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.teamSize ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
              {errors.teamSize && (
                <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>
              )}
            </div>
          )}

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              placeholder="Maximum number of participants"
              min="1"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              required
              value={formData.registrationDeadline}
            min={eventTime?.startDate}
            max={eventTime?.endDate}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.registrationDeadline ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.registrationDeadline && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationDeadline}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="startTime"
              required
              value={formData.startTime}
            min={eventTime?.startDate}
            max={eventTime?.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="endTime"
              required
              value={formData.endTime}
                          min={eventTime?.startDate}
            max={eventTime?.endDate}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.endTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </span>
              ) : (
                "Create Competition"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/coordinator/events/${eventId}/competitions`)}
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

export default CreateCompetitions;

