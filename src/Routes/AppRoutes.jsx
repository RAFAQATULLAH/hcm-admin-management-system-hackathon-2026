import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../Components/auth/AdminLogin";
import AdminSignup from "../Components/auth/AdminSignup";
import AdminUpdatePassword from "../Components/auth/AdminUpdatePassword";
import AdminLayout from "../Components/layout/AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import HRManagement from "../Pages/AdminDashboard/HRManagement";
import Employees from "../Pages/AdminDashboard/Employees";
import Settings from "../Pages/AdminDashboard/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public authentication pages */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />

      {/* Every admin-only page is protected and uses the same layout */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/update-password" element={<AdminUpdatePassword />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/hr" element={<HRManagement />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
