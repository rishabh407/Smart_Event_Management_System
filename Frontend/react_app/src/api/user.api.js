// api/user.api.js

import api from "./axios";


export const getDepartmentTeachers = () => {
  return api.get("/users/hod/teachers");
};

export const toggleTeacherStatus = (id) => {
  return api.patch(`/users/hod/teachers/${id}/status`);
};

export const createTeacher = (data) => {
  return api.post("/users/hod/teachers", data);
};

export const updateTeacher = (id, data) => {
  return api.put(`/users/hod/teachers/${id}`, data);
};