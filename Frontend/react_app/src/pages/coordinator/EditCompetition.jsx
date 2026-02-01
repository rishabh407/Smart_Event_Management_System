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

  // ================= FETCH DATA =================

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

    } catch (error) {

      console.error("Error fetching competition:", error);
      toast.error("Failed to load competition");
      navigate(-1);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCompetition();
  }, [id]);

  // ================= VALIDATION =================

  const validateForm = () => {

    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Competition name is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";

    if (formData.type === "team") {

      if (!formData.minTeamSize || !formData.maxTeamSize) {
        newErrors.teamSize = "Team size is required";
      } else if (+formData.minTeamSize > +formData.maxTeamSize) {
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

  // ================= INPUT HANDLER =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    try {

      setSubmitting(true);

      await updateCompetition(id, formData);

      toast.success("Competition updated successfully!");
      navigate(-1);

    } catch (error) {

      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");

    } finally {

      setSubmitting(false);

    }

  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <div className="text-center text-gray-600">
          Loading competition...
        </div>
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto px-3 sm:px-6">

      {/* HEADER */}

      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit Competition
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Update competition details
        </p>
      </div>

      {/* FORM CARD */}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Competition Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Short Description *
            </label>

            <textarea
              rows="3"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* VENUE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Venue *
            </label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Competition Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg border-gray-300"
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>

          {/* TEAM SIZE */}

          {formData.type === "team" && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                type="number"
                name="minTeamSize"
                value={formData.minTeamSize}
                onChange={handleChange}
                placeholder="Min Team Size"
                className="border px-3 py-2 rounded-lg"
              />

              <input
                type="number"
                name="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={handleChange}
                placeholder="Max Team Size"
                className="border px-3 py-2 rounded-lg"
              />

            </div>

          )}

          {/* MAX PARTICIPANTS */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Participants
            </label>

            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg border-gray-300"
            />
          </div>

          {/* DATES */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />

          </div>

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg w-full"
          />

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 pt-3">

            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                submitting
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Updating..." : "Update Competition"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border py-3 rounded-lg hover:bg-gray-50"
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
