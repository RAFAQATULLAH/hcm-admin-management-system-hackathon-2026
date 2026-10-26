
import axios from "axios";

const settingsAPI = axios.create({
  baseURL: "http://localhost:4000/api/admin/settings",
});

settingsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default settingsAPI;
