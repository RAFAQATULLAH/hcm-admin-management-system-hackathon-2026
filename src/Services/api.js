import axios from "axios";

const API = axios.create({
  baseURL: "https://hcm-management-system-backend-hacka.vercel.app/api/admin-auth",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
