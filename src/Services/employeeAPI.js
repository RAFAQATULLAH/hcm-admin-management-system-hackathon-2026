import axios from "axios";

const employeeAPI = axios.create({
  baseURL: "http://localhost:4000/api/admin/employees",
});

employeeAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default employeeAPI;