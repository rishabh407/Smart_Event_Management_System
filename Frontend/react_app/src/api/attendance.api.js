import api from "./axios";

export const markattendance=async(id)=>{
   return api.post("/attendance/mark",id);
}