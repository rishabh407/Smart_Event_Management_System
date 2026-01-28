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

