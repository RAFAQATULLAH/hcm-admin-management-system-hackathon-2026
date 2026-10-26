import axios from "axios";

const loginAPI = axios.create({
 baseURL: "http://localhost:4000/api/admin-auth",
});

loginAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default loginAPI;