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

