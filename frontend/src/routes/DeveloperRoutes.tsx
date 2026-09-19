import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/DeveloperLayout";
import AuthLayout from "@/layouts/AuthLayout";
import NotFound from "@/pages/NotFound";

// Pages
import DeveloperLoginPage from "../pages/auth/developer/DeveloperLoginPage";
import Dashboard from "../pages/developer/dashboard/dashboard";
import RbacTestPortal from "../pages/developer/testpad/RbacTestPortal";
import UsersPage from "../pages/developer/users/UsersPage";
import RolesPage from "../pages/developer/roles/RolesPage";
import SettingsPage from "../pages/developer/setting/settings";

export default function DeveloperRoutes() {
  return (
    <Routes>
      {/* Dedicated Developer Portal Login (Public/Unprotected) */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<DeveloperLoginPage />} />
      </Route>

      {/* Protected Developer Routes */}
      <Route element={<ProtectedRoute loginPath="/dev/login" />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="testpad" element={<RbacTestPortal />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredPermission="users:read">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute requiredPermission="roles:read">
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredPermission="settings:read">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Catch-all within developer layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Catch-all fallback for dev routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
