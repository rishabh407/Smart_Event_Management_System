import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCompetition } from "../../api/competition.api";

const CreateCompetitions = () => {

 const { eventId } = useParams();
 const navigate = useNavigate();

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

 const handleChange = (e) => {

  setFormData({
   ...formData,
   [e.target.name]: e.target.value
  });

 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

   const payload = {
    ...formData,
    eventId
   };

   await createCompetition(payload);

   alert("Competition Created Successfully");

   navigate(`/coordinator/events/${eventId}/competitions`);

  } catch (error) {

   alert(error.response?.data?.message || "Error creating competition");

  }

 };

 return (

  <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

   <h1 className="text-xl font-bold mb-4">
    Create Competition
   </h1>

   <form onSubmit={handleSubmit} className="space-y-4">

    <input
     type="text"
     name="name"
     placeholder="Competition Name"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <textarea
     name="shortDescription"
     placeholder="Short Description"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <input
     type="text"
     name="venue"
     placeholder="Venue"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    {/* Competition Type */}

    <select
     name="type"
     className="w-full border p-2"
     onChange={handleChange}
    >

     <option value="individual">
      Individual
     </option>

     <option value="team">
      Team
     </option>

    </select>

    {/* Team Fields */}

    {formData.type === "team" && (

     <div className="flex gap-3">

      <input
       type="number"
       name="minTeamSize"
       placeholder="Min Team Size"
       className="border p-2 w-full"
       onChange={handleChange}
      />

      <input
       type="number"
       name="maxTeamSize"
       placeholder="Max Team Size"
       className="border p-2 w-full"
       onChange={handleChange}
      />

     </div>

    )}

    <input
     type="number"
     name="maxParticipants"
     placeholder="Max Participants"
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>Registration Deadline</label>

    <input
     type="datetime-local"
     name="registrationDeadline"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>Start Time</label>

    <input
     type="datetime-local"
     name="startTime"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>End Time</label>

    <input
     type="datetime-local"
     name="endTime"
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <button
     type="submit"
     className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
    >
     Create Competition
    </button>

   </form>

  </div>

 );
};

export default CreateCompetitions;
