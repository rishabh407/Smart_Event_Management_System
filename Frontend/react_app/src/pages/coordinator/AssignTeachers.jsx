import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCompetitionById } from "../../api/competition.api";
import { getDepartmentTeachers } from "../../api/teacher.api";
import {
 assignTeacher,
 removeTeacher
} from "../../api/competition.api";

const AssignTeachers = () => {

 const { competitionId } = useParams();

 const [competition, setCompetition] = useState(null);
 const [teachers, setTeachers] = useState([]);

 const [teacherId, setTeacherId] = useState("");
 const [role, setRole] = useState("INCHARGE");

 const fetchData = async () => {

  try {

   const compRes = await getCompetitionById(competitionId);
   setCompetition(compRes.data);

   const teacherRes = await getDepartmentTeachers();
   setTeachers(teacherRes.data);

  } catch (error) {

   alert("Failed to load data");

  }

 };

 useEffect(() => {
  fetchData();
 }, [competitionId]);

 const handleAssign = async () => {

  if (!teacherId || !role) {
   return alert("Select teacher and role");
  }

  try {

   await assignTeacher({
    competitionId,
    teacherId,
    role
   });

   setTeacherId("");
   setRole("INCHARGE");

   fetchData();

  } catch (error) {

   alert(error.response?.data?.message || "Assign failed");

  }

 };

const handleRemove = async (tid) => {

 console.log("REMOVE CLICKED");
 console.log("Teacher ID SENT:", tid);
 console.log("Competition ID:", competitionId);

 try {
  await removeTeacher({
   competitionId,
   teacherId: tid
  });

  fetchData();

 } catch (error) {
  console.log(error);
  alert("Remove failed");
 }
};



 if (!competition) {
  return <p>Loading...</p>;
 }

 return (

  <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

   <h1 className="text-xl font-bold mb-4">
    Assign Teachers – {competition.name}
   </h1>

   {/* ASSIGN FORM */}

   <div className="flex gap-3 mb-6">

    <select
     value={teacherId}
     onChange={(e) => setTeacherId(e.target.value)}
     className="border p-2 w-full"
    >
     <option value="">Select Teacher</option>

     {teachers.map(t => (
      <option key={t._id} value={t._id}>
       {t.fullName}
      </option>
     ))}

    </select>

    <select
     value={role}
     onChange={(e) => setRole(e.target.value)}
     className="border p-2"
    >
     <option value="INCHARGE">Incharge</option>
     <option value="JUDGE">Judge</option>
    </select>

    <button
     onClick={handleAssign}
     className="bg-green-600 text-white px-4 rounded"
    >
     Assign
    </button>

   </div>

   {/* ASSIGNED TEACHERS LIST */}

   <h2 className="font-semibold mb-2">
    Assigned Teachers
   </h2>

   {competition.assignedTeachers.length === 0 && (
    <p className="text-gray-500">No teachers assigned</p>
   )}

   {competition.assignedTeachers.map(item => (

    <div
     key={item.teacher}

     className="flex justify-between items-center border p-3 mb-2 rounded"
    >

     <div>
      <p className="font-medium">
       {item.teacher.fullName}
      </p>
      <p className="text-sm text-gray-600">
       Role: {item.role}
      </p>
     </div>

     <button
      onClick={() => handleRemove(item.teacher)}

      className="text-red-600"
     >
      Remove
     </button>

    </div>

   ))}

  </div>

 );
};

export default AssignTeachers;
