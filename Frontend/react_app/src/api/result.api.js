import api from "./axios";

// Declare results for a competition
export const declareResults = (competitionId, winners) => {
  return api.post("/results/declare", {
    competitionId,
    winners
  });
};

// Get results for a competition
export const getCompetitionResults = (competitionId) => {
  return api.get(`/results/competition/${competitionId}`);
};

// Get student's results (all competitions they participated in)
export const getMyResults = () => {
  return api.get("/results/my");
};

// Get coordinator's results (all competitions in their events)
export const getCoordinatorResults = () => {
  return api.get("/results/coordinator/my");
};

// Get HOD's results (all competitions in their department's events)
export const getHodResults = () => {
  return api.get("/results/hod/my");
};
