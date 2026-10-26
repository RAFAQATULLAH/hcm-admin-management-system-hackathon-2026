import axios from "axios";

const adminAPI = axios.create({
 baseURL: "hcm-management-system-backend-hackathon-2026-prqcicu16.vercel.app/api/admin",
});

adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminAPI;