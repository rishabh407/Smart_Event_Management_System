// import api from "./axios";

import api from "./axios";

// CREATE EVENT (HOD)
export const createEvent = (formData) => {
  return api.post("/events", formData);
};

// GET ALL EVENTS (HOD + STUDENT)
export const getAllEvents = () => {
  return api.get("/events");
};

// GET STUDENT EVENTS (Department Based)
export const getStudentEvents = () => {
  return api.get("/events/student/my");
};

// HOD events
export const getMyEvents = () => api.get("/events/hod/my");

// Delete / Restore
export const deleteEvent = (id) => api.patch(`/events/${id}/delete`);

export const restoreEvent = (id) => api.patch(`/events/${id}/restore`);

export const updateEvent = (id, formData) => {
  return api.put(`/events/${id}/update`, formData);
};

export const getEventById = (id) => {
  return api.get(`/events/${id}`);
};

// HOD DASHBOARD STATS
export const getHodDashboardStats = (params = {}) => {
  return api.get("/events/hod/dashboard-stats", {
    params,
  });
};

// Event Performance Ranking
export const getEventPerformanceRanking = () => {
  return api.get("/events/hod/performance-ranking");
};

export const publishEvent = (id) => {
  api.patch(`/events/${id}/publish`);
};

export const unpublishEvent = (id) => {
  api.patch(`/events/${id}/unpublish`);
};

export const getCoordinatorEvents = () => {
 return api.get("/events/coordinator/my");
};