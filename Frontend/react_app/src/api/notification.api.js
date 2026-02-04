import api from "./axios";

export const getMyNotifications = () => {
  return api.get("/notifications/my");
};

export const clearMyNotifications = () => {
  return api.post("/notifications/clear");
};
