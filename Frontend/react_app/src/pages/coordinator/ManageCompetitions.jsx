import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
 getEventCompetitions,
 publishCompetition,
 unpublishCompetition
} from "../../api/competition.api";

const ManageCompetitions = () => {

 const { eventId } = useParams();
 const navigate = useNavigate();

 const [competitions, setCompetitions] = useState([]);
 const [loading, setLoading] = useState(true);

 const fetchCompetitions = async () => {

  try {

   const res = await getEventCompetitions(eventId);
   setCompetitions(res.data);
   setLoading(false);

  } catch (error) {

   console.log(error);
   setLoading(false);

  }

 };

 useEffect(() => {
  fetchCompetitions();
 }, [eventId]);

const handlePublish = async (id) => {

 try {

  const res = await publishCompetition(id);

  console.log("Publish API Response:", res.data);

  await fetchCompetitions();

 } catch (error) {
  console.log("Publish Error:", error.response?.data || error);
 }
};


const handleUnpublish = async (id) => {

 try {

  const res = await unpublishCompetition(id);

  console.log("Unpublish API Response:", res.data);

  await fetchCompetitions();

 } catch (error) {
  console.log("Unpublish Error:", error.response?.data || error);
 }
};


 if (loading) {
  return <p>Loading competitions...</p>;
 }

 return (

  <div>

   {/* Header */}
   <div className="flex justify-between items-center mb-5">

    <h1 className="text-xl font-bold">
     Event Competitions
    </h1>

    <button
     onClick={() =>
      navigate(`/coordinator/events/${eventId}/competitions/create`)
     }
     className="bg-green-600 text-white px-4 py-2 rounded"
    >
     + Create Competition
    </button>

   </div>

   {/* Competition List */}

   {competitions.length === 0 && (
    <p className="text-gray-500">
     No competitions created yet.
    </p>
   )}

   {competitions.map(comp => (

    <div
     key={comp._id}
     className="bg-white p-4 mb-3 rounded shadow"
    >

     <div className="flex justify-between items-center">

      <div>
       <h2 className="font-semibold">
        {comp.name}
       </h2>

       <p className="text-sm text-gray-600">
        Type: {comp.type}
       </p>
      </div>

      <span
       className={`px-3 py-1 rounded text-sm ${
        comp.isPublished
         ? "bg-green-100 text-green-700"
         : "bg-red-100 text-red-700"
       }`}
      >
       {comp.isPublished ? "Published" : "Draft"}
      </span>

     </div>

     {/* Buttons */}

     <div className="mt-3 flex gap-2">

      <button
       onClick={() =>
        navigate(`/coordinator/competitions/${comp._id}/assign-teachers`)
       }
       className="bg-blue-600 text-white px-3 py-1 rounded"
      >
       Assign Teachers
      </button>

      <button
       onClick={() =>
        navigate(`/coordinator/competitions/edit/${comp._id}`)
       }
       className="bg-yellow-500 text-white px-3 py-1 rounded"
      >
       Edit
      </button>

      {comp.isPublished ? (

       <button
        onClick={() => handleUnpublish(comp._id)}
        className="bg-red-600 text-white px-3 py-1 rounded"
       >
        Unpublish
       </button>

      ) : (

       <button
        onClick={() => handlePublish(comp._id)}
        className="bg-green-600 text-white px-3 py-1 rounded"
       >
        Publish
       </button>

      )}

     </div>

    </div>

   ))}

  </div>

 );
};

export default ManageCompetitions;
