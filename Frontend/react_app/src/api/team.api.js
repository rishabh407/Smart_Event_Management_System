import api from "./axios";

export const createTeam = (data) => {
  return api.post("/teams/create", data);
};

export const joinTeam = (data) => {
  return api.post("/teams/join", data);
};

export const leaveTeam = (data) => {
  return api.post("/teams/leave", data);
};

export const deleteTeam = (teamId) => {
  return api.delete("/teams/delete", {
    data: { teamId }
  });
};

export const getMyTeams = (competitionId) => {
  return api.get(`/teams/my/${competitionId}`);
};
export const getMyTeamsByUserId=()=>{
  return api.get("/teams/teambyuser");
}

