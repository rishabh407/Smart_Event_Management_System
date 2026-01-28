import api from "./axios";

// Get teachers of coordinator department
export const getDepartmentTeachers = () => {
 return api.get("/teachers/department");
};
