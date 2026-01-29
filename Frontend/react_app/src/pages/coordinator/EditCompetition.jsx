import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
 getCompetitionById,
 updateCompetition
} from "../../api/competition.api";

const EditCompetition = () => {

 const { id } = useParams();
 const navigate = useNavigate();

 const [loading, setLoading] = useState(true);

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

 // Load competition data

const fetchCompetition = async () => {
   try {
    const res = await getCompetitionById(id);
    const data = res.data;
    console.log(data);
    setFormData({
     name: data.name,
     shortDescription: data.shortDescription,
     venue: data.venue,
     type: data.type,
     minTeamSize: data.minTeamSize || "",
     maxTeamSize: data.maxTeamSize || "",
     maxParticipants: data.maxParticipants || "",
     registrationDeadline: data.registrationDeadline.slice(0, 16),
     startTime: data.startTime.slice(0, 16),
     endTime: data.endTime.slice(0, 16)
    });

    setLoading(false);

   } catch (error) {

    alert("Failed to load competition");
    navigate(-1);

   }

  };

 useEffect(() => {
  fetchCompetition();
 }, [id]);

 const handleChange = (e) => {

  setFormData({
   ...formData,
   [e.target.name]: e.target.value
  });

 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

   await updateCompetition(id, formData);

   alert("Competition Updated Successfully");

   navigate(-1);

  } catch (error) {

   alert(error.response?.data?.message || "Update failed");

  }

 };

 if (loading) {
  return <p>Loading competition...</p>;
 }

 return (

  <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

   <h1 className="text-xl font-bold mb-4">
    Edit Competition
   </h1>

   <form onSubmit={handleSubmit} className="space-y-4">

    <input
     type="text"
     name="name"
     value={formData.name}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <textarea
     name="shortDescription"
     value={formData.shortDescription}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <input
     type="text"
     name="venue"
     value={formData.venue}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    {formData.type === "team" && (

     <div className="flex gap-3">

      <input
       type="number"
       name="minTeamSize"
       value={formData.minTeamSize}
       placeholder="Min Team Size"
       className="border p-2 w-full"
       onChange={handleChange}
      />

      <input
       type="number"
       name="maxTeamSize"
       value={formData.maxTeamSize}
       placeholder="Max Team Size"
       className="border p-2 w-full"
       onChange={handleChange}
      />

     </div>

    )}

    <input
     type="number"
     name="maxParticipants"
     value={formData.maxParticipants}
     placeholder="Max Participants"
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>Registration Deadline</label>

    <input
     type="datetime-local"
     name="registrationDeadline"
     value={formData.registrationDeadline}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>Start Time</label>

    <input
     type="datetime-local"
     name="startTime"
     value={formData.startTime}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <label>End Time</label>

    <input
     type="datetime-local"
     name="endTime"
     value={formData.endTime}
     required
     className="w-full border p-2"
     onChange={handleChange}
    />

    <button
     type="submit"
     className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
    >
     Update Competition
    </button>

   </form>

  </div>

 );
};

export default EditCompetition;

