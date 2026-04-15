

import api from "./axios";


export const exportAttendance = (competitionId) => {
  return api.get(`/exports/attendance/${competitionId}`, {
    responseType: "blob"
  });
};

export const exportResults = (competitionId) => {
  return api.get(`/exports/results/${competitionId}`, {
    responseType: "blob"
  });
};

export const exportParticipants = (competitionId) => {
  return api.get(`/exports/participants/${competitionId}`, {
    responseType: "blob"
  });
};
