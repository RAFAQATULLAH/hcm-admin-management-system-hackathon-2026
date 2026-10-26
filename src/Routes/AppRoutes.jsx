import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../Components/auth/AdminLogin";
import AdminSignup from "../Components/auth/AdminSignup";
import AdminUpdatePassword from "../Components/auth/AdminUpdatePassword";
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

      {/* Pages requiring an Admin token */}
      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/update-password"
          element={<AdminUpdatePassword />}
        />

        {/* Add the dashboard here when you create it */}
        {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
      </Route>
      <Route element={<AdminProtectedRoute />}>
 <Route element={<AdminProtectedRoute />}>
  <Route
    path="/dashboard"
    element={<AdminDashboard />}
  />
  <Route
    path="/update-password"
    element={<AdminUpdatePassword />}
  />
</Route>

  <Route
    path="/update-password"
    element={<AdminUpdatePassword />}
  />
</Route>
<Route path="/hr" element={<HRManagement />} />
<Route path="/employees" element={<Employees />} />
<Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
