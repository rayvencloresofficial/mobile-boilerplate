import { useState, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Stack, IconButton, Sheet, Drawer } from "@mui/joy";
import { Building2, Menu } from "lucide-react";
import Typography from "@/components/ui/Typography";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useThemeColors } from "@/hooks/useThemeColors";

export const AdminLayout: FC = () => {
  const location = useLocation();
  const { colors } = useThemeColors();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItemNames: Record<string, string> = {
    "/admin": "Admin Dashboard",
    "/admin/": "Admin Dashboard",
    "/admin/dashboard": "Admin Dashboard",
    "/admin/rooms/calendar": "Room Calendar",
    "/admin/rooms/check-in": "Guest Check-In",
    "/admin/rooms/manage": "Room Management",
    "/admin/bookings/all": "All Bookings",
    "/admin/bookings/online": "Online Reservations",
    "/admin/bookings/walk-in": "Walk-In Bookings",
    "/admin/bookings/cancellations": "Booking Cancellations",
    "/admin/financials/sales-invoices": "Sales & Invoices",
    "/admin/financials/expense-tracker": "Expense Tracker",
    "/admin/financials/profit-loss": "Profit & Loss Overview",
    "/admin/financials/roi": "Return on Investment (ROI)",
    "/admin/analytics-reports/sales": "Sales Analytics",
    "/admin/analytics-reports/financial": "Financial Reports",
    "/admin/analytics-reports/catering": "Catering & Events Report",
    "/admin/market-pricing/dynamic": "Dynamic Pricing Engine",
    "/admin/market-pricing/competitor-monitor": "Competitor Rate Monitor",
    "/admin/market-pricing/rate-suggestions": "Room Rate Suggestions",
    "/admin/staff-management/directory": "Employee Directory",
    "/admin/staff-management/roles-permissions": "Staff Roles & Permissions",
    "/admin/staff-management/shifts": "Shift Scheduling",
    "/admin/staff-management/audit-logs": "Activity & Audit Logs",
    "/admin/settings": "Portal Settings",
  };

  const currentTitle = navItemNames[location.pathname] || "Business Workspace";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        bgcolor: colors.dominant,
      }}
    >
      {/* 1. Desktop Persistent Sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <AdminSidebar />
      </Box>

      {/* 2. Mobile Header Bar & Drawer */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            height: 56,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(12px)",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(13, 16, 23, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            borderBottom:
              "1px solid var(--joy-palette-neutral-outlinedBorder, rgba(0,0,0,0.08))",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </IconButton>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "6px",
                  bgcolor: "primary.solidBg",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={16} />
              </Box>
              <Typography variant="body" size="xs" bold>
                Admin Hub
              </Typography>
            </Stack>
          </Stack>
        </Sheet>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        size="sm"
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <AdminSidebar
          isMobile
          closeMobileSidebar={() => setMobileMenuOpen(false)}
        />
      </Drawer>

      {/* 3. Main Content Column */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          mt: { xs: "56px", md: 0 },
        }}
      >
        {/* Desktop Topbar Header */}
        <Sheet
          variant="plain"
          sx={{
            display: { xs: "none", md: "flex" },
            height: 64,
            px: 4,
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${colors.cardBorder}`,
            bgcolor: colors.surface,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="header" size="xs" bold>
              {currentTitle}
            </Typography>
          </Stack>
        </Sheet>

        {/* Dynamic Page Router View */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
