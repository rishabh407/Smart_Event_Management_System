

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

export const getDepartmentStudents = () =>
  api.get("/users/students");

export const createStudent = (data) =>
  api.post("/users/students", data);

export const updateStudent = (id, data) =>
  api.put(`/users/students/${id}`, data);

export const toggleStudentStatus = (id) =>
  api.patch(`/users/students/status/${id}`);

export const uploadStudents = (file) => {

  const formData = new FormData();

  formData.append("file", file);

  return api.post("/users/students/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

};

export const getDepartmentCoordinator = () =>
  api.get("/users/coordinator");

export const createCoordinator = (data) =>
  api.post("/users/create-coordinator", data);

export const updateCoordinator = (id, data) =>
  api.patch(`/users/update-coordinator/${id}`, data);