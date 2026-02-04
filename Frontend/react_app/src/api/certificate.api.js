import api from "./axios";

export const generateCertificates = (competitionId) => {
  return api.post("/certificates/generate", { competitionId });
};

export const getMyCertificates = () => {
  return api.get("/certificates/my");
};

// export const uploadTemplate = (formData) => {
//   return api.post("/certificate-templates/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };


export const uploadTemplate = (formData) => {
  return api.post(
    "/certificate-templates/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

export const previewCertificateTemplate = (formData) => {
  return api.post(
    "/certificate-templates/preview",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      responseType: "blob"
    }
  );
};