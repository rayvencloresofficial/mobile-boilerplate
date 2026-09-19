import { Route, Routes } from "react-router-dom";

import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import AdminRoutes from "./AdminRoutes";
import DeveloperRoutes from "./DeveloperRoutes";
import ClientRoutes from "./ClientRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Admin Portal Subtree (e.g. /admin/login, /admin/dashboard, /admin/rooms) */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/business/*" element={<AdminRoutes />} />

      {/* 2. Developer Portal Subtree (e.g. /dev/login, /dev/dashboard, /dev/testpad) */}
      <Route path="/dev/*" element={<DeveloperRoutes />} />
      <Route path="/developer/*" element={<DeveloperRoutes />} />

      {/* 3. Global Authorization Clearance Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 4. Client & Public Portal Subtree (e.g. /, /about, /login, /portal) */}
      <Route path="/*" element={<ClientRoutes />} />

      {/* 5. Global Catch-all fallback for any non-existing root routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
