// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { createCompetition } from "../../api/competition.api";
// import toast from "react-hot-toast";
// import { getEventById } from "../../api/event.api";

// const CreateCompetitions = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();

//   const [eventTime, setEventTime] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     shortDescription: "",
//     venue: "",
//     rules: "", // ✅ NEW FIELD
//     type: "individual",
//     minTeamSize: 1,
//     maxTeamSize: 1,
//     maxParticipants: "",
//     registrationDeadline: "",
//     startTime: "",
//     endTime: ""
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   // ================= FETCH EVENT TIME =================

//   useEffect(() => {
//     const fetchEventTime = async () => {
//       try {
//         const res = await getEventById(eventId);
//         setEventTime(res.data);
//       } catch (err) {
//         toast.error("Failed to load event timing");
//         console.error(err.message);
//       }
//     };

//     fetchEventTime();
//   }, [eventId]);

//   // ================= HANDLE INPUT =================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ""
//       });
//     }
//   };

//   // ================= VALIDATION =================

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Competition name is required";
//     }

//     if (!formData.shortDescription.trim()) {
//       newErrors.shortDescription = "Short description is required";
//     }

//     if (!formData.rules.trim()) {
//       newErrors.rules = "Competition rules are required";
//     }

//     if (!formData.venue.trim()) {
//       newErrors.venue = "Venue is required";
//     }

//     if (formData.type === "team") {
//       if (!formData.minTeamSize || !formData.maxTeamSize) {
//         newErrors.teamSize = "Team size is required";
//       } else if (parseInt(formData.minTeamSize) > parseInt(formData.maxTeamSize)) {
//         newErrors.teamSize = "Min team size cannot be greater than max team size";
//       }
//     }

//     if (formData.registrationDeadline && formData.startTime) {
//       if (new Date(formData.registrationDeadline) >= new Date(formData.startTime)) {
//         newErrors.registrationDeadline =
//           "Registration deadline must be before start time";
//       }
//     }

//     if (formData.startTime && formData.endTime) {
//       if (new Date(formData.startTime) >= new Date(formData.endTime)) {
//         newErrors.endTime = "End time must be after start time";
//       }
//     }

//     if (eventTime) {
//       const eventStart = new Date(eventTime.startDate);
//       const eventEnd = new Date(eventTime.endDate);

//       if (
//         new Date(formData.startTime) < eventStart ||
//         new Date(formData.endTime) > eventEnd
//       ) {
//         newErrors.timeRange =
//           "Competition time must be inside event duration";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         ...formData,
//         eventId
//       };

//       await createCompetition(payload);

//       toast.success("Competition created successfully!");

//       navigate(`/coordinator/events/${eventId}/competitions`);
//     } catch (error) {
//       console.error("Error creating competition:", error);

//       toast.error(
//         error.response?.data?.message || "Error creating competition"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">

//       {/* ================= HEADER ================= */}

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Create Competition
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Add a new competition to this event
//         </p>
//       </div>

//       {/* ================= FORM ================= */}

//       <div className="bg-white rounded-lg shadow-md p-6">

//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* Competition Name */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Competition Name <span className="text-red-500">*</span>
//             </label>

//             <input
//               type="text"
//               name="name"
//               placeholder="Enter competition name"
//               required
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//             )}
//           </div>

//           {/* Short Description */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Short Description <span className="text-red-500">*</span>
//             </label>

//             <textarea
//               name="shortDescription"
//               placeholder="Brief description of the competition"
//               required
//               value={formData.shortDescription}
//               onChange={handleChange}
//               rows="3"
//               className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
//                 errors.shortDescription ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.shortDescription && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.shortDescription}
//               </p>
//             )}
//           </div>

//           {/* Competition Rules */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Competition Rules <span className="text-red-500">*</span>
//             </label>

//             <textarea
//               name="rules"
//               placeholder="Write the rules for this competition..."
//               required
//               rows="5"
//               value={formData.rules}
//               onChange={handleChange}
//               className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
//                 errors.rules ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.rules && (
//               <p className="mt-1 text-sm text-red-600">{errors.rules}</p>
//             )}
//           </div>

//           {/* Venue */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Venue <span className="text-red-500">*</span>
//             </label>

//             <input
//               type="text"
//               name="venue"
//               placeholder="Competition venue"
//               required
//               value={formData.venue}
//               onChange={handleChange}
//               className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
//                 errors.venue ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.venue && (
//               <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
//             )}
//           </div>

//           {/* Competition Type */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Competition Type <span className="text-red-500">*</span>
//             </label>

//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             >
//               <option value="individual">Individual</option>
//               <option value="team">Team</option>
//             </select>
//           </div>

//           {/* Team Fields */}

//           {formData.type === "team" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Team Size <span className="text-red-500">*</span>
//               </label>

//               <div className="grid grid-cols-2 gap-4">

//                 <input
//                   type="number"
//                   name="minTeamSize"
//                   placeholder="Min Team Size"
//                   min="1"
//                   value={formData.minTeamSize}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-4 py-3"
//                 />

//                 <input
//                   type="number"
//                   name="maxTeamSize"
//                   placeholder="Max Team Size"
//                   min="1"
//                   value={formData.maxTeamSize}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-4 py-3"
//                 />

//               </div>

//               {errors.teamSize && (
//                 <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>
//               )}
//             </div>
//           )}

//           {/* Max Participants */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Max Participants
//             </label>

//             <input
//               type="number"
//               name="maxParticipants"
//               placeholder="Maximum participants"
//               min="1"
//               value={formData.maxParticipants}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {/* Registration Deadline */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Registration Deadline <span className="text-red-500">*</span>
//             </label>

//             <input
//               type="datetime-local"
//               name="registrationDeadline"
//               required
//               value={formData.registrationDeadline}
//               min={eventTime?.startDate}
//               max={eventTime?.endDate}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {/* Start Time */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Start Time <span className="text-red-500">*</span>
//             </label>

//             <input
//               type="datetime-local"
//               name="startTime"
//               required
//               value={formData.startTime}
//               min={eventTime?.startDate}
//               max={eventTime?.endDate}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {/* End Time */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               End Time <span className="text-red-500">*</span>
//             </label>

//             <input
//               type="datetime-local"
//               name="endTime"
//               required
//               value={formData.endTime}
//               min={eventTime?.startDate}
//               max={eventTime?.endDate}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />

//             {errors.endTime && (
//               <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
//             )}
//           </div>

//           {/* Buttons */}

//           <div className="flex gap-4 pt-4">

//             <button
//               type="submit"
//               disabled={submitting}
//               className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium ${
//                 submitting ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {submitting ? "Creating..." : "Create Competition"}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(`/coordinator/events/${eventId}/competitions`)
//               }
//               className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCompetitions;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCompetition } from "../../api/competition.api";
import toast from "react-hot-toast";
import { getEventById } from "../../api/event.api";
import DateTimePicker from "../../components/DateTimePicker"; // adjust path as needed

// ── Helper: current datetime as "YYYY-MM-DDTHH:MM" ──────────────────────────
const getNowISO = () => {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}T${pad(n.getHours())}:${pad(n.getMinutes())}`;
};

// ── Convert stored UTC date → "YYYY-MM-DDTHH:MM" local ──────────────────────
const toLocalISO = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

// ── Clamp a datetime string between a min and max ────────────────────────────
// Returns "" if val is outside [min, max]
const clampDateTime = (val, min, max) => {
  if (!val || val.endsWith("T")) return "";
  if (min && val < min) return "";
  if (max && val > max) return "";
  return val;
};

const CreateCompetitions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventTime, setEventTime] = useState(null);   // raw event object
  const [eventStart, setEventStart] = useState("");   // "YYYY-MM-DDTHH:MM"
  const [eventEnd, setEventEnd] = useState("");       // "YYYY-MM-DDTHH:MM"

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    rules: "",
    venue: "",
    type: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    maxParticipants: "",
    registrationDeadline: "",
    startTime: "",
    endTime: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Keep "now" updated every minute
  const [nowISO, setNowISO] = useState(getNowISO());
  useEffect(() => {
    const interval = setInterval(() => setNowISO(getNowISO()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch event boundaries ───────────────────────────────────────────────
  useEffect(() => {
    const fetchEventTime = async () => {
      try {
        const res = await getEventById(eventId);
        setEventTime(res.data);
        setEventStart(toLocalISO(res.data.startDate));
        setEventEnd(toLocalISO(res.data.endDate));
      } catch (err) {
        toast.error("Failed to load event timing");
        console.error(err.message);
      }
    };
    fetchEventTime();
  }, [eventId]);

  // ── Generic field handler ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // ── DateTime handlers ────────────────────────────────────────────────────

  // Registration deadline: must be inside event, and before startTime
  const handleRegistrationChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      registrationDeadline: val,
      // if new deadline is after existing startTime, clear startTime
      startTime: prev.startTime && val >= prev.startTime ? "" : prev.startTime,
    }));
    if (errors.registrationDeadline) setErrors({ ...errors, registrationDeadline: "" });
  };

  // Start time: must be inside event, after registration deadline
  const handleStartTimeChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      startTime: val,
      // if new startTime is after existing endTime, clear endTime
      endTime: prev.endTime && val >= prev.endTime ? "" : prev.endTime,
    }));
    if (errors.startTime) setErrors({ ...errors, startTime: "" });
  };

  // End time: must be inside event, after startTime
  const handleEndTimeChange = (val) => {
    setFormData((prev) => ({ ...prev, endTime: val }));
    if (errors.endTime) setErrors({ ...errors, endTime: "" });
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Competition name is required";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!formData.rules.trim()) newErrors.rules = "Competition rules are required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";

    if (formData.type === "team") {
      if (!formData.minTeamSize || !formData.maxTeamSize) {
        newErrors.teamSize = "Team size is required";
      } else if (parseInt(formData.minTeamSize) > parseInt(formData.maxTeamSize)) {
        newErrors.teamSize = "Min team size cannot be greater than max team size";
      }
    }

    // Registration deadline
    if (!formData.registrationDeadline || formData.registrationDeadline.endsWith("T")) {
      newErrors.registrationDeadline = "Registration deadline is required";
    } else {
      if (eventStart && formData.registrationDeadline < eventStart)
        newErrors.registrationDeadline = "Registration deadline must be within the event duration";
      if (eventEnd && formData.registrationDeadline > eventEnd)
        newErrors.registrationDeadline = "Registration deadline must be within the event duration";
      if (formData.startTime && formData.registrationDeadline >= formData.startTime)
        newErrors.registrationDeadline = "Registration deadline must be before competition start time";
    }

    // Start time
    if (!formData.startTime || formData.startTime.endsWith("T")) {
      newErrors.startTime = "Start time is required";
    } else {
      if (eventStart && formData.startTime < eventStart)
        newErrors.startTime = "Start time must be within the event duration";
      if (eventEnd && formData.startTime > eventEnd)
        newErrors.startTime = "Start time must be within the event duration";
    }

    // End time
    if (!formData.endTime || formData.endTime.endsWith("T")) {
      newErrors.endTime = "End time is required";
    } else {
      if (eventEnd && formData.endTime > eventEnd)
        newErrors.endTime = "End time must be within the event duration";
      if (formData.startTime && formData.endTime <= formData.startTime)
        newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      setSubmitting(true);
      await createCompetition({ ...formData, eventId });
      toast.success("Competition created successfully!");
      navigate(`/coordinator/events/${eventId}/competitions`);
    } catch (error) {
      console.error("Error creating competition:", error);
      toast.error(error.response?.data?.message || "Error creating competition");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived mins for each picker ─────────────────────────────────────────
  // Each picker's lower bound = max(eventStart, nowISO) so past is blocked
  // AND anything before the event start is blocked
  const effectiveMin = eventStart > nowISO ? eventStart : nowISO;

  // Registration deadline: between effectiveMin and eventEnd (but must be < startTime)
  const regDeadlineMax = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime  // cap at startTime if already chosen
    : eventEnd;

  // Start time: after registration deadline (if set), within event
  const startTimeMin = formData.registrationDeadline && !formData.registrationDeadline.endsWith("T")
    ? formData.registrationDeadline
    : effectiveMin;

  // End time: after startTime, within event
  const endTimeMin = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime
    : effectiveMin;

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Competition</h1>
        <p className="text-gray-600 mt-1">Add a new competition to this event</p>

        {/* Event boundary info bar */}
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

      {/* ── Form ── */}
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
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shortDescription"
              placeholder="Brief description of the competition"
              value={formData.shortDescription}
              onChange={handleChange}
              rows="3"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.shortDescription ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Rules <span className="text-red-500">*</span>
            </label>
            <textarea
              name="rules"
              placeholder="Write the rules for this competition..."
              rows="5"
              value={formData.rules}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.rules ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.rules && <p className="mt-1 text-sm text-red-600">{errors.rules}</p>}
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
              value={formData.venue}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
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

          {/* Team Size */}
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
                  min="1"
                  value={formData.minTeamSize}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
                <input
                  type="number"
                  name="maxTeamSize"
                  placeholder="Max Team Size"
                  min="1"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              {errors.teamSize && <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>}
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
              placeholder="Maximum participants"
              min="1"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* ── DateTime pickers ── */}

          {/* Registration Deadline */}
          <DateTimePicker
            label="Registration Deadline"
            value={formData.registrationDeadline}
            onChange={handleRegistrationChange}
            minDateTime={effectiveMin}
            maxDateTime={regDeadlineMax}
            disabled={!eventStart}
            required
            error={errors.registrationDeadline}
          />

          {/* Start Time & End Time side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateTimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={handleStartTimeChange}
              minDateTime={startTimeMin}
              maxDateTime={eventEnd}
              disabled={!eventStart}
              required
              error={errors.startTime}
            />
            <DateTimePicker
              label="End Time"
              value={formData.endTime}
              onChange={handleEndTimeChange}
              minDateTime={endTimeMin}
              maxDateTime={eventEnd}
              disabled={!formData.startTime || formData.startTime.endsWith("T")}
              required
              error={errors.endTime}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Creating..." : "Create Competition"}
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