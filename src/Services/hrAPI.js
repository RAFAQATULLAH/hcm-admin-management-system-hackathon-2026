
import axios from "axios";

const hrAPI = axios.create({
  baseURL: "http://localhost:4000/api/admin/hr",
});

hrAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default hrAPI;
