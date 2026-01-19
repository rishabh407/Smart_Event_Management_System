import api from "./axios";

export const getAllEvents = () => {
  return api.get("/events");
};
