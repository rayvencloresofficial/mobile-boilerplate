import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";

// Dashboard
import Dashboard from "@/pages/admin/dashboard/Dashboard";

// Rooms
import RoomCalendar from "@/pages/admin/rooms/RoomCalendar";
import CheckIn from "@/pages/admin/rooms/CheckIn";
import ManageRoom from "@/pages/admin/rooms/ManageRoom";

// Bookings
import AllBookings from "@/pages/admin/bookings/AllBookings";
import OnlineReservations from "@/pages/admin/bookings/OnlineReservations";
import WalkIn from "@/pages/admin/bookings/WalkIn";
import Cancellations from "@/pages/admin/bookings/Cancellations";

// Financials
import SalesInvoices from "@/pages/admin/financials/SalesInvoices";
import ExpenseTracker from "@/pages/admin/financials/ExpenseTracker";
import ProfitLoss from "@/pages/admin/financials/ProfitLoss";
import Roi from "@/pages/admin/financials/Roi";

// Analytics & Reports
import AnalyticsReports from "@/pages/admin/analytics-reports/AnalyticsReports";
import SalesReport from "@/pages/admin/analytics-reports/SalesReport";
import FinancialReports from "@/pages/admin/analytics-reports/FinancialReports";
import CateringReport from "@/pages/admin/analytics-reports/CateringReport";

// Market & Pricing
import DynamicPricing from "@/pages/admin/market-pricing/DynamicPricing";
import CompetitorMonitor from "@/pages/admin/market-pricing/CompetitorMonitor";
import RateSuggestions from "@/pages/admin/market-pricing/RateSuggestions";

// Staff Management
import EmployeeDirectory from "@/pages/admin/staff-management/EmployeeDirectory";
import RolesPermissions from "@/pages/admin/staff-management/RolesPermissions";
import ShiftScheduling from "@/pages/admin/staff-management/ShiftScheduling";
import AuditLogs from "@/pages/admin/staff-management/AuditLogs";

// Settings
import Settings from "@/pages/admin/settings/Settings";
import AdminLoginPage from "@/pages/auth/admin/AdminLoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import NotFound from "@/pages/NotFound";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Dedicated Admin Portal Login (Public/Unprotected) */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<AdminLoginPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute
            loginPath="/admin/login"
            requiredRole={["super_admin", "admin", "manager"]}
          />
        }
      >
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Rooms */}
          <Route path="rooms">
            <Route index element={<Navigate to="calendar" replace />} />
            <Route path="calendar" element={<RoomCalendar />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="manage" element={<ManageRoom />} />
          </Route>

          {/* Bookings */}
          <Route path="bookings">
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<AllBookings />} />
            <Route path="online" element={<OnlineReservations />} />
            <Route path="walk-in" element={<WalkIn />} />
            <Route path="cancellations" element={<Cancellations />} />
          </Route>

          {/* Financials */}
          <Route path="financials">
            <Route index element={<Navigate to="sales-invoices" replace />} />
            <Route path="sales-invoices" element={<SalesInvoices />} />
            <Route path="expense-tracker" element={<ExpenseTracker />} />
            <Route path="profit-loss" element={<ProfitLoss />} />
            <Route path="roi" element={<Roi />} />
          </Route>

          {/* Analytics & Reports */}
          <Route path="analytics-reports">
            <Route index element={<AnalyticsReports />} />
            <Route path="sales" element={<SalesReport />} />
            <Route path="financial" element={<FinancialReports />} />
            <Route path="catering" element={<CateringReport />} />
          </Route>

          {/* Market & Pricing */}
          <Route path="market-pricing">
            <Route index element={<Navigate to="dynamic" replace />} />
            <Route path="dynamic" element={<DynamicPricing />} />
            <Route path="competitor-monitor" element={<CompetitorMonitor />} />
            <Route path="rate-suggestions" element={<RateSuggestions />} />
          </Route>

          {/* Staff Management */}
          <Route path="staff-management">
            <Route index element={<Navigate to="directory" replace />} />
            <Route path="directory" element={<EmployeeDirectory />} />
            <Route path="roles-permissions" element={<RolesPermissions />} />
            <Route path="shifts" element={<ShiftScheduling />} />
            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* Catch-all fallback within admin layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Catch-all fallback for admin routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
