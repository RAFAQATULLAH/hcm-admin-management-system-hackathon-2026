
import axios from "axios";

const settingsAPI = axios.create({
 baseURL: `${
    import.meta.env.DEV
      ? "http://localhost:4000"
      : "https://hcm-management-system-backend-hacka.vercel.app"
  }/api/admin/settings`,
});

settingsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default settingsAPI;
