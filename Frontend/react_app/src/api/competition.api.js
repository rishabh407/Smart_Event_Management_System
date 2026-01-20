import api from "./axios";

export const getCompetitionsByEvent = (eventId) => {
  return api.get(`/competitions/event/${eventId}`);
};

export const getCompetitionById=(competitionId)=>{
  return api.get(`/competitions/${competitionId}`);
}