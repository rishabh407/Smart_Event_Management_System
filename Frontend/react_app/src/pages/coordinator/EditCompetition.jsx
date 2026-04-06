// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getCompetitionById, updateCompetition } from "../../api/competition.api";
// import toast from "react-hot-toast";

// const EditCompetition = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     shortDescription: "",
//     venue: "",
//     rules: "",
//     type: "individual",
//     minTeamSize: "",
//     maxTeamSize: "",
//     maxParticipants: "",
//     registrationDeadline: "",
//     startTime: "",
//     endTime: ""
//   });

//   const [errors, setErrors] = useState({});

//   // ================= FETCH COMPETITION =================

//   const fetchCompetition = async () => {

//     try {

//       setLoading(true);

//       const res = await getCompetitionById(id);
//       const data = res.data;

//       setFormData({
//         name: data.name || "",
//         shortDescription: data.shortDescription || "",
//         venue: data.venue || "",
//         rules: data.rules || "",
//         type: data.type || "individual",
//         minTeamSize: data.minTeamSize || "",
//         maxTeamSize: data.maxTeamSize || "",
//         maxParticipants: data.maxParticipants || "",
//         registrationDeadline: data.registrationDeadline
//           ? data.registrationDeadline.slice(0, 16)
//           : "",
//         startTime: data.startTime ? data.startTime.slice(0, 16) : "",
//         endTime: data.endTime ? data.endTime.slice(0, 16) : ""
//       });

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to load competition");
//       navigate(-1);

//     } finally {

//       setLoading(false);

//     }

//   };

//   useEffect(() => {
//     fetchCompetition();
//   }, [id]);

//   // ================= VALIDATION =================

//   const validateForm = () => {

//     const newErrors = {};

//     if (!formData.name.trim())
//       newErrors.name = "Competition name is required";

//     if (!formData.shortDescription.trim())
//       newErrors.shortDescription = "Short description is required";

//     if (!formData.rules.trim())
//       newErrors.rules = "Competition rules are required";

//     if (!formData.venue.trim())
//       newErrors.venue = "Venue is required";

//     if (formData.type === "team") {

//       if (!formData.minTeamSize || !formData.maxTeamSize) {
//         newErrors.teamSize = "Team size is required";
//       }

//       if (+formData.minTeamSize > +formData.maxTeamSize) {
//         newErrors.teamSize = "Min team size cannot exceed max team size";
//       }

//     }

//     if (formData.registrationDeadline && formData.startTime) {

//       if (
//         new Date(formData.registrationDeadline) >=
//         new Date(formData.startTime)
//       ) {
//         newErrors.registrationDeadline =
//           "Registration deadline must be before start time";
//       }

//     }

//     if (formData.startTime && formData.endTime) {

//       if (new Date(formData.startTime) >= new Date(formData.endTime)) {
//         newErrors.endTime = "End time must be after start time";
//       }

//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;

//   };

//   // ================= HANDLE INPUT =================

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: ""
//       }));
//     }

//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix the errors");
//       return;
//     }

//     try {

//       setSubmitting(true);

//       await updateCompetition(id, formData);

//       toast.success("Competition updated successfully");

//       navigate(-1);

//     } catch (error) {

//       console.error(error);

//       toast.error(
//         error.response?.data?.message || "Failed to update competition"
//       );

//     } finally {

//       setSubmitting(false);

//     }

//   };

//   // ================= LOADING =================

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[250px]">
//         <p className="text-gray-600">Loading competition...</p>
//       </div>
//     );
//   }

//   return (

//     <div className="max-w-3xl mx-auto p-6">

//       {/* HEADER */}

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Edit Competition
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Update competition details
//         </p>
//       </div>

//       {/* FORM */}

//       <div className="bg-white rounded-lg shadow-md p-6">

//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* NAME */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Competition Name *
//             </label>

//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full border px-4 py-3 rounded-lg ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.name && (
//               <p className="text-red-600 text-sm mt-1">{errors.name}</p>
//             )}
//           </div>

//           {/* DESCRIPTION */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Short Description *
//             </label>

//             <textarea
//               name="shortDescription"
//               rows="3"
//               value={formData.shortDescription}
//               onChange={handleChange}
//               className={`w-full border px-4 py-3 rounded-lg ${
//                 errors.shortDescription
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//             />

//             {errors.shortDescription && (
//               <p className="text-red-600 text-sm mt-1">
//                 {errors.shortDescription}
//               </p>
//             )}
//           </div>

//           {/* RULES */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Competition Rules *
//             </label>

//             <textarea
//               name="rules"
//               rows="5"
//               value={formData.rules}
//               onChange={handleChange}
//               className={`w-full border px-4 py-3 rounded-lg ${
//                 errors.rules ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.rules && (
//               <p className="text-red-600 text-sm mt-1">{errors.rules}</p>
//             )}
//           </div>

//           {/* VENUE */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Venue *
//             </label>

//             <input
//               type="text"
//               name="venue"
//               value={formData.venue}
//               onChange={handleChange}
//               className={`w-full border px-4 py-3 rounded-lg ${
//                 errors.venue ? "border-red-500" : "border-gray-300"
//               }`}
//             />

//             {errors.venue && (
//               <p className="text-red-600 text-sm mt-1">{errors.venue}</p>
//             )}
//           </div>

//           {/* TYPE */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Competition Type
//             </label>

//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full border px-4 py-3 rounded-lg border-gray-300"
//             >
//               <option value="individual">Individual</option>
//               <option value="team">Team</option>
//             </select>
//           </div>

//           {/* TEAM SIZE */}

//           {formData.type === "team" && (

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 Team Size
//               </label>

//               <div className="grid grid-cols-2 gap-4">

//                 <input
//                   type="number"
//                   name="minTeamSize"
//                   placeholder="Min Team Size"
//                   value={formData.minTeamSize}
//                   onChange={handleChange}
//                   className="border px-4 py-3 rounded-lg"
//                 />

//                 <input
//                   type="number"
//                   name="maxTeamSize"
//                   placeholder="Max Team Size"
//                   value={formData.maxTeamSize}
//                   onChange={handleChange}
//                   className="border px-4 py-3 rounded-lg"
//                 />

//               </div>

//               {errors.teamSize && (
//                 <p className="text-red-600 text-sm mt-1">{errors.teamSize}</p>
//               )}

//             </div>

//           )}

//           {/* MAX PARTICIPANTS */}

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Max Participants
//             </label>

//             <input
//               type="number"
//               name="maxParticipants"
//               value={formData.maxParticipants}
//               onChange={handleChange}
//               className="w-full border px-4 py-3 rounded-lg border-gray-300"
//             />
//           </div>

//           {/* DATES */}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//             <input
//               type="datetime-local"
//               name="registrationDeadline"
//               value={formData.registrationDeadline}
//               onChange={handleChange}
//               className="border px-4 py-3 rounded-lg"
//             />

//             <input
//               type="datetime-local"
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleChange}
//               className="border px-4 py-3 rounded-lg"
//             />

//           </div>

//           <input
//             type="datetime-local"
//             name="endTime"
//             value={formData.endTime}
//             onChange={handleChange}
//             className="border px-4 py-3 rounded-lg w-full"
//           />

//           {/* BUTTONS */}

//           <div className="flex gap-4 pt-4">

//             <button
//               type="submit"
//               disabled={submitting}
//               className={`flex-1 py-3 rounded-lg font-semibold text-white ${
//                 submitting
//                   ? "bg-gray-400"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {submitting ? "Updating..." : "Update Competition"}
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="flex-1 border py-3 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>

//   );

// };

// export default EditCompetition;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionById, updateCompetition } from "../../api/competition.api";
import { getEventById } from "../../api/event.api";
import toast from "react-hot-toast";
import DateTimePicker from "../../components/DateTimePicker"; // adjust path as needed

// ── Helper: current datetime as "YYYY-MM-DDTHH:MM" ──────────────────────────
const getNowISO = () => {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}T${pad(n.getHours())}:${pad(n.getMinutes())}`;
};

// ── Convert stored UTC/ISO date → "YYYY-MM-DDTHH:MM" local ──────────────────
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

  // Event boundaries fetched alongside competition
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // Original pre-filled values — used as fallback min so pre-filled
  // dates aren't blocked even if they are slightly in the past
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

  // Keep "now" updated every minute
  const [nowISO, setNowISO] = useState(getNowISO());
  useEffect(() => {
    const interval = setInterval(() => setNowISO(getNowISO()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch competition + parent event boundaries ───────────────────────────
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

        // Fetch parent event to get boundaries
        if (data.eventId) {
          try {
            const eventRes = await getEventById(data.eventId);
            setEventStart(toLocalISO(eventRes.data.startDate));
            setEventEnd(toLocalISO(eventRes.data.endDate));
          } catch {
            // Non-blocking — boundaries just won't be enforced in picker UI
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

  // ── Generic field handler ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── DateTime handlers ────────────────────────────────────────────────────

  const handleRegistrationChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      registrationDeadline: val,
      // Clear startTime if it's now <= new deadline
      startTime: prev.startTime && val >= prev.startTime ? "" : prev.startTime,
    }));
    if (errors.registrationDeadline)
      setErrors((prev) => ({ ...prev, registrationDeadline: "" }));
  };

  const handleStartTimeChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      startTime: val,
      // Clear endTime if it's now <= new startTime
      endTime: prev.endTime && val >= prev.endTime ? "" : prev.endTime,
    }));
    if (errors.startTime) setErrors((prev) => ({ ...prev, startTime: "" }));
  };

  const handleEndTimeChange = (val) => {
    setFormData((prev) => ({ ...prev, endTime: val }));
    if (errors.endTime) setErrors((prev) => ({ ...prev, endTime: "" }));
  };

  // ── Validation ───────────────────────────────────────────────────────────
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

    // Registration deadline
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

    // Start time
    if (!formData.startTime || formData.startTime.endsWith("T")) {
      newErrors.startTime = "Start time is required";
    } else {
      if (eventStart && formData.startTime < eventStart)
        newErrors.startTime = "Must be within the event duration";
      if (eventEnd && formData.startTime > eventEnd)
        newErrors.startTime = "Must be within the event duration";
    }

    // End time
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

  // ── Submit ───────────────────────────────────────────────────────────────
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

  // ── Derived min values ───────────────────────────────────────────────────
  // For edit: use the earlier of (originalValue, eventStart) as the floor
  // so pre-filled values are never accidentally blocked by the picker.
  const effectiveEventStart = eventStart || nowISO;

  // Registration deadline min: original value OR eventStart, whichever is earlier
  const regMin = originalDates.registrationDeadline
    ? (originalDates.registrationDeadline < effectiveEventStart
        ? originalDates.registrationDeadline
        : effectiveEventStart)
    : effectiveEventStart;

  // Registration deadline max: startTime if chosen, else eventEnd
  const regMax = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime
    : eventEnd;

  // Start time min: after registration deadline (if set) OR original start OR eventStart
  const startMin = formData.registrationDeadline && !formData.registrationDeadline.endsWith("T")
    ? formData.registrationDeadline
    : (originalDates.startTime
        ? (originalDates.startTime < effectiveEventStart
            ? originalDates.startTime
            : effectiveEventStart)
        : effectiveEventStart);

  // End time min: after startTime OR original end OR eventStart
  const endMin = formData.startTime && !formData.startTime.endsWith("T")
    ? formData.startTime
    : (originalDates.endTime
        ? (originalDates.endTime < effectiveEventStart
            ? originalDates.endTime
            : effectiveEventStart)
        : effectiveEventStart);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <p className="text-gray-600">Loading competition...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Competition</h1>
        <p className="text-gray-600 mt-1">Update competition details</p>

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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
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

          {/* Short Description */}
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

          {/* Rules */}
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
              className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.venue ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
          </div>

          {/* Type */}
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
              className="w-full border border-gray-300 px-4 py-3 rounded-lg"
            />
          </div>

          {/* ── DateTime pickers ── */}

          {/* Registration Deadline */}
          <DateTimePicker
            label="Registration Deadline"
            value={formData.registrationDeadline}
            onChange={handleRegistrationChange}
            minDateTime={regMin}
            maxDateTime={regMax}
            required
            error={errors.registrationDeadline}
          />

          {/* Start Time & End Time */}
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

          {/* Buttons */}
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