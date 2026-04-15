import api from "./axios";


export const getDepartmentTeachers = () => {
 return api.get("/teachers/department");
};

export const getinchargeteacherscompetitions=(eventId)=>{
    return api.get(`/teachers/teacher/assigned/${eventId}`);
};

export const getTeacherDashboardStats = () => {
 return api.get("/teachers/teacher/dashboard-stats");
};

export const getAllAssignedCompetitions = () => {
  return api.get("/teachers/competitions");
};


