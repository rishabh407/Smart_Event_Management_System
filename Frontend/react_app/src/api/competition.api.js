import api from "./axios";


export const getCompetitionById=(competitionId)=>{
  return api.get(`/competitions/${competitionId}`);
}


export const getEventCompetitions = (eventId) => {
 return api.get(`/competitions/event/${eventId}`);
};

export const getEventPublicCompetitions=(eventId)=>{
  return api.get(`/competitions/events/${eventId}`);
}


export const publishCompetition = (id) => {
 return api.patch(`/competitions/${id}/publish`);
};


export const unpublishCompetition = (id) => {
 return api.patch(`/competitions/${id}/unpublish`);
};

export const createCompetition = (data) => {
 return api.post("/competitions", data);
};



export const updateCompetition = (id, data) => {
 return api.put(`/competitions/${id}`, data);
};


export const assignTeacher = (data) => {
 return api.post("/assignments/assign", data);
};


export const removeTeacher = (data) => {
 return api.post("/assignments/remove", data);
};

export const getCompetitionDetails = (id) => {
 return api.get(`/competitions/${id}/details`);
};

export const getCoordinatorDashboardStats = () => {
 return api.get("/competitions/coordinator/dashboard-stats");
};

export const toggleCompetitionRegistration = (id) => {
 return api.patch(`/competitions/${id}/toggle-registration`);
};


export const deleteCompetition = (id) => {
  return api.delete(`/competitions/delete/${id}`);
};