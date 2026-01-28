import api from "./axios";

export const getCompetitionsByEvent = (eventId) => {
  return api.get(`/competitions/event/${eventId}`);
};

export const getCompetitionById=(competitionId)=>{
  return api.get(`/competitions/${competitionId}`);
}

// Get competitions of event
export const getEventCompetitions = (eventId) => {
 return api.get(`/competitions/event/${eventId}`);
};

// Publish competition
export const publishCompetition = (id) => {
 return api.patch(`/competitions/${id}/publish`);
};

// Unpublish competition
export const unpublishCompetition = (id) => {
 return api.patch(`/competitions/${id}/unpublish`);
};

export const createCompetition = (data) => {
 return api.post("/competitions", data);
};


// Update competition
export const updateCompetition = (id, data) => {
 return api.put(`/competitions/${id}`, data);
};

// Assign teacher to competition
export const assignTeacher = (data) => {
 return api.post("/assignments/assign", data);
};

// Remove teacher from competition
export const removeTeacher = (data) => {
 return api.post("/assignments/remove", data);
};

export const getCompetitionDetails = (id) => {
 return api.get(`/competitions/${id}/details`);
};
