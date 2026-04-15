

import api from "./axios";


export const createEvent = (formData) => {
  return api.post("/events", formData);
};


export const getAllEvents = () => {
  return api.get("/events");
};


export const getStudentEvents = () => {
  return api.get("/events/student/my");
};


export const getMyEvents = () => api.get("/events/hod/my");


export const deleteEvent = (id) => api.patch(`/events/${id}/delete`);

export const restoreEvent = (id) => api.patch(`/events/${id}/restore`);

export const updateEvent = (id, formData) => {
  return api.put(`/events/${id}/update`, formData);
};

export const getEventById = (id) => {
  return api.get(`/events/${id}`);
};


export const getHodDashboardStats = (params = {}) => {
  return api.get("/events/hod/dashboard-stats", {
    params,
  });
};


export const getEventPerformanceRanking = () => {
  return api.get("/events/hod/performance-ranking");
};

export const publishEvent = (id) => {
  return api.patch(`/events/${id}/publish`);
};

export const unpublishEvent = (id) => {
  return api.patch(`/events/${id}/unpublish`);
};

export const getCoordinatorEvents = () => {
 return api.get("/events/coordinator/my");
};


export const getDepartmentCoordinators = () => {
 return api.get("/events/hod/coordinators");
};


export const getEventCompetitions = (eventId) => {
  return api.get(`/events/${eventId}/competitions`);
};