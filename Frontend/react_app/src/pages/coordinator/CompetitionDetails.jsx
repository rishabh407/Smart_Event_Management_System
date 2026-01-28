import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionDetails } from "../../api/competition.api";

const CompetitionDetails = () => {

 const { id } = useParams();
 const navigate = useNavigate();

 const [competition, setCompetition] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchDetails = async () => {

  try {

   const res = await getCompetitionDetails(id);
  //  console.log(res.data);
   setCompetition(res.data.data);
   setLoading(false);

  } catch (error) {

   console.log(error);
   setLoading(false);

  }

 };

 useEffect(() => {
  fetchDetails();
 }, [id]);

 if (loading) return <p>Loading...</p>;

 if (!competition) return <p>Competition not found</p>;

 return (

  <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">

   {/* HEADER */}

   <div className="flex justify-between items-center mb-4">

    <h1 className="text-2xl font-bold">
     {competition.name}
    </h1>

    <span
     className={`px-3 py-1 rounded text-sm ${
      competition.isPublished
       ? "bg-green-100 text-green-700"
       : "bg-red-100 text-red-700"
     }`}
    >
     {competition.isPublished ? "Published" : "Draft"}
    </span>

   </div>

   {/* BASIC INFO */}

   <div className="grid grid-cols-2 gap-4 mb-4">

    <p><b>Type:</b> {competition.type}</p>
    <p><b>Venue:</b> {competition.venue}</p>

    <p>
     <b>Registration Deadline:</b>{" "}
     {new Date(competition.registrationDeadline).toLocaleString()}
    </p>

    <p>
     <b>Start Time:</b>{" "}
     {new Date(competition.startTime).toLocaleString()}
    </p>

    <p>
     <b>End Time:</b>{" "}
     {new Date(competition.endTime).toLocaleString()}
    </p>

   </div>

   {/* DESCRIPTION */}

   <div className="mb-4">

    <h3 className="font-semibold mb-1">
     Description
    </h3>

    <p className="text-gray-700">
     {competition.shortDescription}
    </p>

   </div>

   {/* ASSIGNED TEACHERS */}

   <div className="mb-4">

    <h3 className="font-semibold mb-2">
     Assigned Teachers
    </h3>

    {competition.assignedTeachers?.length === 0 && (
     <p className="text-gray-500">
      No teachers assigned
     </p>
    )}

    {competition.assignedTeachers?.map(item => (

     <div
      key={item.teacher._id}
      className="border p-2 rounded mb-2"
     >

      <p>
       {item.teacher.fullName}
       {" "}—{" "}
       <span className="text-sm text-gray-600">
        {item.role}
       </span>
      </p>
     </div>

    ))}

   </div>

   {/* ACTION BUTTONS */}

   <div className="flex gap-3">

    <button
     onClick={() =>
      navigate(`/coordinator/competitions/edit/${competition._id}`)
     }
     className="bg-yellow-500 text-white px-4 py-2 rounded"
    >
     Edit
    </button>

    <button
     onClick={() =>
      navigate(`/coordinator/competitions/${competition._id}/assign-teachers`)
     }
     className="bg-blue-600 text-white px-4 py-2 rounded"
    >
     Assign Teachers
    </button>
       <button
 onClick={() =>
  navigate(
   `/coordinator/competitions/${competition._id}/registrations`
  )
 }
 className="bg-purple-600 text-white px-4 py-2 rounded"
>
 View Registrations
</button>

   </div>

  </div>

 );
};

export default CompetitionDetails;
