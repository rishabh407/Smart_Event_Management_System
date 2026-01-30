import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCompetitionById,
  updateCompetition
} from "../../api/competition.api";
import toast from "react-hot-toast";

const EditCompetition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    venue: "",
    type: "",
    minTeamSize: "",
    maxTeamSize: "",
    maxParticipants: "",
    registrationDeadline: "",
    startTime: "",
    endTime: ""
  });

  const [errors, setErrors] = useState({});

  // Load competition data
  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const res = await getCompetitionById(id);
      const data = res.data;
      
      setFormData({
        name: data.name || "",
        shortDescription: data.shortDescription || "",
        venue: data.venue || "",
        type: data.type || "individual",
        minTeamSize: data.minTeamSize || "",
        maxTeamSize: data.maxTeamSize || "",
        maxParticipants: data.maxParticipants || "",
        registrationDeadline: data.registrationDeadline ? data.registrationDeadline.slice(0, 16) : "",
        startTime: data.startTime ? data.startTime.slice(0, 16) : "",
        endTime: data.endTime ? data.endTime.slice(0, 16) : ""
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching competition:", error);
      toast.error("Failed to load competition");
      navigate(-1);
    }
  };

  useEffect(() => {
    fetchCompetition();
  }, [id]);

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
        newErrors.teamSize = "Team size is required for team competitions";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      await updateCompetition(id, formData);
      toast.success("Competition updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating competition:", error);
      toast.error(error.response?.data?.message || "Failed to update competition");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Competition</h1>
        <p className="text-gray-600 mt-1">Update competition details</p>
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
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter competition name"
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
              value={formData.shortDescription}
              onChange={handleChange}
              required
              rows="3"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter short description"
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
              value={formData.venue}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter venue"
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

          {/* Team Size Fields */}
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
                    value={formData.minTeamSize}
                    onChange={handleChange}
                    min="1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.teamSize ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Min Team Size"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="maxTeamSize"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                    min="1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.teamSize ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Max Team Size"
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
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Maximum number of participants"
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
              value={formData.registrationDeadline}
              onChange={handleChange}
              required
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
              value={formData.startTime}
              onChange={handleChange}
              required
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
              value={formData.endTime}
              onChange={handleChange}
              required
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
                  Updating...
                </span>
              ) : (
                "Update Competition"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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

export default EditCompetition;
