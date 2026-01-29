import api from "./axios";

export const getMyRegistrations = () => {
  return api.get("/registrations/my");
};

export const registerIndividual = (data) => {
  return api.post("/registrations/individual", data);
};

export const cancelRegistration = (id) => {
  return api.patch(`/registrations/${id}/cancel`);
};

export const registerTeam = (data) => {
  return api.post("/registrations/team", data);
};

export const deleteRegistration = (id) => {
  return api.delete(`/registrations/${id}/delete`);
};

export const getRegistrationsByCompetition = (competitionId) => {
 return api.get(`/registrations/competition/${competitionId}`);
};

export const getCompetitionRegistrationStats = (id) => {
 return api.get(`/registrations/competition/${id}/stats`);
};

export const getCompetitionRegistrations = (id) => {
 return api.get(`/registrations/competition/${id}`);
};
