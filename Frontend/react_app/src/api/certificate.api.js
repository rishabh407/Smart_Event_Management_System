import api from "./axios";

export const generateCertificates = (competitionId) => {
 return api.post("/certificates/generate", { competitionId });
};

export const getMyCertificates = () => {
 return api.get("/certificates/my");
};

