import api from "./axios";


export const declareResults = (competitionId, winners) => {
  return api.post("/results/declare", {
    competitionId,
    winners
  });
};


export const getCompetitionResults = (competitionId) => {
  return api.get(`/results/competition/${competitionId}`);
};


export const getMyResults = () => {
  return api.get("/results/my");
};


export const getCoordinatorResults = () => {
  return api.get("/results/coordinator/my");
};


export const getHodResults = () => {
  return api.get("/results/hod/my");
};
