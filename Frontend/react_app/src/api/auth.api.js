import api from "./axios";

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};
