import { Route, Routes } from "react-router-dom";

import Home from "@/pages/client/home/Home";
import About from "@/pages/client/about/About";
import UserPortal from "@/pages/client/user/UserPortal";
import ClientLayout from "@/layouts/ClientLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import NotFound from "@/pages/NotFound";

// Dedicated Login Pages
import ClientLoginPage from "@/pages/auth/client/ClientLoginPage";

export default function ClientRoutes() {
  return (
    <Routes>
      {/* 1. AUTHENTICATION ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<ClientLoginPage />} />
      </Route>

      {/* 2. PUBLIC & STANDARD USER ROUTES */}
      <Route element={<ClientLayout />}>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route
            path="portal"
            element={
              <ProtectedRoute loginPath="/login">
                <UserPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="user"
            element={
              <ProtectedRoute loginPath="/login">
                <UserPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="guest"
            element={
              <ProtectedRoute loginPath="/login">
                <UserPortal />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Catch-all fallback for non-existing client routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
