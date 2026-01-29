import api from "./axios";

// Get teachers of coordinator department
export const getDepartmentTeachers = () => {
 return api.get("/teachers/department");
};

export const getinchargeteacherscompetitions=()=>{
    return api.get("/teachers/teacher/assigned");
};