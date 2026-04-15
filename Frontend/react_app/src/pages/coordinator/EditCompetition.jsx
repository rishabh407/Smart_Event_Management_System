import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionById, updateCompetition } from "../../api/competition.api";
import { getEventById } from "../../api/event.api";
import toast from "react-hot-toast";
import DateTimePicker from "../../components/DateTimePicker"; 

const getNowISO = () => {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}T${pad(n.getHours())}:${pad(n.getMinutes())}`;
};

const toLocalISO = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const EditCompetition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [originalDates, setOriginalDates] = useState({
    registrationDeadline: "",
    startTime: "",
    endTime: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    venue: "",
    rules: "",
    type: "individual",
    minTeamSize: "",
    maxTeamSize: "",
    maxParticipants: "",
    registrationDeadline: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});

  const [nowISO, setNowISO] = useState(getNowISO());
  useEffect(() => {
    const interval = setInterval(() => setNowISO(getNowISO()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCompetitionById(id);
        const data = res.data;

        const regDeadline = toLocalISO(data.registrationDeadline);
        const start = toLocalISO(data.startTime);
        const end = toLocalISO(data.endTime);

        setFormData({
          name: data.name || "",
          shortDescription: data.shortDescription || "",
          venue: data.venue || "",
          rules: data.rules || "",
          type: data.type || "individual",
          minTeamSize: data.minTeamSize || "",
          maxTeamSize: data.maxTeamSize || "",
          maxParticipants: data.maxParticipants || "",
          registrationDeadline: regDeadline,
          startTime: start,
          endTime: end,
        });

        setOriginalDates({
          registrationDeadline: regDeadline,
          startTime: start,
          endTime: end,
        });
        if (data.eventId) {
          try {
            const eventRes = await getEventById(data.eventId);
            setEventStart(toLocalISO(eventRes.data.startDate));
            setEventEnd(toLocalISO(eventRes.data.endDate));
          } catch {
            console.warn("Could not fetch parent event boundaries");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load competition");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const handleRegistrationChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      registrationDeadline: val,
      startTime: prev.startTime && val >= prev.startTime ? "" : prev.startTime,
    }));
    if (errors.registrationDeadline)
      setErrors((prev) => ({ ...prev, registrationDeadline: "" }));
  };

  const handleStartTimeChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      startTime: val,
      endTime: prev.endTime && val >= prev.endTime ? "" : prev.endTime,
    }));
    if (errors.startTime) setErrors((prev) => ({ ...prev, startTime: "" }));
  };

  const handleEndTimeChange = (val) => {
    setFormData((prev) => ({ ...prev, endTime: val }));
    if (errors.endTime) setErrors((prev) => ({ ...prev, endTime: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Competition name is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.rules.trim()) newErrors.rules = "Competition rules are required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";

    if (formData.type === "team") {
      if (!formData.minTeamSize || !formData.maxTeamSize)
        newErrors.teamSize = "Team size is required";
      else if (+formData.minTeamSize > +formData.maxTeamSize)
        newErrors.teamSize = "Min team size cannot exceed max team size";
    }
    if (!formData.registrationDeadline || formData.registrationDeadline.endsWith("T")) {
      newErrors.registrationDeadline = "Registration deadline is required";
    } else {
      if (eventStart && formData.registrationDeadline < eventStart)
        newErrors.registrationDeadline = "Must be within the event duration";
      if (eventEnd && formData.registrationDeadline > eventEnd)
        newErrors.registrationDeadline = "Must be within the event duration";
      if (formData.startTime && formData.registrationDeadline >= formData.startTime)
        newErrors.registrationDeadline = "Must be before competition start time";
    }

    if (!formData.startTime || formData.startTime.endsWith("T")) {
      newErrors.startTime = "Start time is required";
    } else {
      if (eventStart && formData.startTime < eventStart)
        newErrors.startTime = "Must be within the event duration";
      if (eventEnd && formData.startTime > eventEnd)
        newErrors.startTime = "Must be within the event duration";
    }

    if (!formData.endTime || formData.endTime.endsWith("T")) {
      newErrors.endTime = "End time is required";
    } else {
      if (eventEnd && formData.endTime > eventEnd)
        newErrors.endTime = "Must be within the event duration";
      if (formData.startTime && formData.endTime <= formData.startTime)
        newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }
    try {
      setSubmitting(true);
      await updateCompetition(id, formData);
      toast.success("Competition updated successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update competition");
    } finally {
      setSubmitting(false);
    }
  };

  const effectiveEventStart = eventStart || nowISO;

  const regMin = originalDates.registrationDeadline
    ? (originalDates.registrationDeadline < effectiveEventStart
        ? originalDates.registrationDeadline
        : effectiveEventStart)
    : effectiveEventStart;

  const regMax = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime
    : eventEnd;

  const startMin = formData.registrationDeadline && !formData.registrationDeadline.endsWith("T")
    ? formData.registrationDeadline
    : (originalDates.startTime
        ? (originalDates.startTime < effectiveEventStart
            ? originalDates.startTime
            : effectiveEventStart)
        : effectiveEventStart);

  const endMin = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime
    : (originalDates.endTime
        ? (originalDates.endTime < effectiveEventStart
            ? originalDates.endTime
            : effectiveEventStart)
        : effectiveEventStart);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <p className="text-gray-600">Loading competition...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Competition</h1>
        <p className="text-gray-600 mt-1">Update competition details</p>
        {eventStart && eventEnd && (
          <div className="mt-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 flex-shrink-0">ℹ️</span>
            <p className="text-sm text-blue-700">
              All competition times must be within the event duration:{" "}
              <strong>
                {new Date(eventStart).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </strong>{" "}
              →{" "}
              <strong>
                {new Date(eventEnd).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </strong>
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDescription"
              rows="3"
              value={formData.shortDescription}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Rules <span className="text-red-500">*</span>
            </label>
            <textarea
              name="rules"
              rows="5"
              value={formData.rules}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.rules ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.rules && <p className="text-red-600 text-sm mt-1">{errors.rules}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>

          {formData.type === "team" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="minTeamSize"
                  placeholder="Min Team Size"
                  value={formData.minTeamSize}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg"
                />
                <input
                  type="number"
                  name="maxTeamSize"
                  placeholder="Max Team Size"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-3 rounded-lg"
                />
              </div>
              {errors.teamSize && <p className="text-red-600 text-sm mt-1">{errors.teamSize}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg"
            />
          </div>
          <DateTimePicker
            label="Registration Deadline"
            value={formData.registrationDeadline}
            onChange={handleRegistrationChange}
            minDateTime={regMin}
            maxDateTime={regMax}
            required
            error={errors.registrationDeadline}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateTimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={handleStartTimeChange}
              minDateTime={startMin}
              maxDateTime={eventEnd}
              required
              error={errors.startTime}
            />
            <DateTimePicker
              label="End Time"
              value={formData.endTime}
              onChange={handleEndTimeChange}
              minDateTime={endMin}
              maxDateTime={eventEnd}
              disabled={!formData.startTime || formData.startTime.endsWith("T")}
              required
              error={errors.endTime}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Updating..." : "Update Competition"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
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