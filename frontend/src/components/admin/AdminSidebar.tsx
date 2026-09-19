import { useState, type FC, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, IconButton, Divider, Typography } from "@mui/joy";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  UserCheck,
  Sliders,
  BookOpenCheck,
  ListFilter,
  Globe,
  Footprints,
  CalendarX,
  DollarSign,
  Receipt,
  Wallet,
  TrendingUp,
  Percent,
  BarChart3,
  LineChart,
  UtensilsCrossed,
  Tags,
  Activity,
  Eye,
  Sparkles,
  Users2,
  Contact,
  ShieldAlert,
  Clock,
  ScrollText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";

interface NavSubItem {
  title: string;
  path: string;
  icon: ReactNode;
}

interface NavGroup {
  id: string;
  title: string;
  icon: ReactNode;
  children: NavSubItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "rooms",
    title: "Rooms",
    icon: <BedDouble size={18} />,
    children: [
      {
        title: "Room Calendar",
        path: "/admin/rooms/calendar",
        icon: <CalendarDays size={16} />,
      },
      {
        title: "Check-In",
        path: "/admin/rooms/check-in",
        icon: <UserCheck size={16} />,
      },
      {
        title: "Manage Room",
        path: "/admin/rooms/manage",
        icon: <Sliders size={16} />,
      },
    ],
  },
  {
    id: "bookings",
    title: "Bookings",
    icon: <BookOpenCheck size={18} />,
    children: [
      {
        title: "All Bookings",
        path: "/admin/bookings/all",
        icon: <ListFilter size={16} />,
      },
      {
        title: "Online Reservations",
        path: "/admin/bookings/online",
        icon: <Globe size={16} />,
      },
      {
        title: "Walk-in",
        path: "/admin/bookings/walk-in",
        icon: <Footprints size={16} />,
      },
      {
        title: "Cancellations",
        path: "/admin/bookings/cancellations",
        icon: <CalendarX size={16} />,
      },
    ],
  },
  {
    id: "financials",
    title: "Financials",
    icon: <DollarSign size={18} />,
    children: [
      {
        title: "Sales & Invoices",
        path: "/admin/financials/sales-invoices",
        icon: <Receipt size={16} />,
      },
      {
        title: "Expense Tracker",
        path: "/admin/financials/expense-tracker",
        icon: <Wallet size={16} />,
      },
      {
        title: "Profit & Loss Overview",
        path: "/admin/financials/profit-loss",
        icon: <TrendingUp size={16} />,
      },
      {
        title: "ROI",
        path: "/admin/financials/roi",
        icon: <Percent size={16} />,
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    icon: <BarChart3 size={18} />,
    children: [
      {
        title: "Sales Report",
        path: "/admin/analytics-reports/sales",
        icon: <TrendingUp size={16} />,
      },
      {
        title: "Financial Reports",
        path: "/admin/analytics-reports/financial",
        icon: <LineChart size={16} />,
      },
      {
        title: "Catering",
        path: "/admin/analytics-reports/catering",
        icon: <UtensilsCrossed size={16} />,
      },
    ],
  },
  {
    id: "pricing",
    title: "Market & Pricing",
    icon: <Tags size={18} />,
    children: [
      {
        title: "Dynamic Pricing",
        path: "/admin/market-pricing/dynamic",
        icon: <Activity size={16} />,
      },
      {
        title: "Competitor Rate Monitor",
        path: "/admin/market-pricing/competitor-monitor",
        icon: <Eye size={16} />,
      },
      {
        title: "Room Rate Suggestions",
        path: "/admin/market-pricing/rate-suggestions",
        icon: <Sparkles size={16} />,
      },
    ],
  },
  {
    id: "staff",
    title: "Staff Management",
    icon: <Users2 size={18} />,
    children: [
      {
        title: "Employee Directory",
        path: "/admin/staff-management/directory",
        icon: <Contact size={16} />,
      },
      {
        title: "Roles & Permissions",
        path: "/admin/staff-management/roles-permissions",
        icon: <ShieldAlert size={16} />,
      },
      {
        title: "Shift Scheduling",
        path: "/admin/staff-management/shifts",
        icon: <Clock size={16} />,
      },
      {
        title: "Activity & Audit Logs",
        path: "/admin/staff-management/audit-logs",
        icon: <ScrollText size={16} />,
      },
    ],
  },
];

interface AdminSidebarProps {
  isMobile?: boolean;
  closeMobileSidebar?: () => void;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({
  isMobile = false,
  closeMobileSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, setMode, colors } = useThemeColors();

  // Keep expanded groups open by default if child is active
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    for (const group of NAV_GROUPS) {
      initialState[group.id] = group.children.some((child) =>
        location.pathname.startsWith(child.path),
      );
    }
    return initialState;
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLinkClick = () => {
    if (isMobile && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const isDashboardActive =
    location.pathname === "/admin" ||
    location.pathname === "/admin/" ||
    location.pathname === "/admin/dashboard";
  const isSettingsActive = location.pathname.startsWith("/admin/settings");

  const primaryRole = user?.roles?.[0] || "user";

  return (
    <Box
      sx={{
        width: 270,
        height: "100dvh",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: colors.surface,
        borderRight: `1px solid ${colors.cardBorder}`,
        p: 2,
        boxSizing: "border-box",
      }}
    >
      {/* 1. Portal Brand Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, pb: 1.5, borderBottom: `1px solid ${colors.cardBorder}` }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "primary.solidBg",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
            }}
          >
            <Building2 size={20} />
          </Box>
          <Box>
            <Typography
              level="title-sm"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Business Portal
            </Typography>
            <Typography
              level="body-xs"
              sx={{
                fontSize: "0.68rem",
                color: "text.secondary",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Manage Business
            </Typography>
          </Box>
        </Stack>

        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          title="Toggle color theme"
          sx={{ borderRadius: "8px" }}
        >
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
      </Stack>

      {/* 3. Navigation Links List */}
      <Box sx={{ flex: 1, overflowY: "scroll", pr: 0.5 }}>
        <Typography
          level="body-xs"
          sx={{
            fontFamily: "var(--font-code, monospace)",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
            mb: 0.75,
            fontWeight: 600,
          }}
        >
          Menu
        </Typography>

        <Stack spacing={0.5}>
          {/* Dashboard Link */}
          <Box
            component={Link}
            to="/admin"
            onClick={handleLinkClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.25,
              py: 0.9,
              borderRadius: "8px",
              textDecoration: "none",
              color: isDashboardActive ? colors.accent : "text.primary",
              bgcolor: isDashboardActive
                ? mode === "dark"
                  ? "rgba(99, 102, 241, 0.12)"
                  : "rgba(99, 102, 241, 0.08)"
                : "transparent",
              fontWeight: isDashboardActive ? 600 : 500,
              fontSize: "0.85rem",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.03)",
              },
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Box>

          {/* Grouped Modules with Sub-Items */}
          {NAV_GROUPS.map((group) => {
            const isOpen = Boolean(openGroups[group.id]);
            const hasActiveChild = group.children.some((child) =>
              location.pathname.startsWith(child.path),
            );

            return (
              <Box key={group.id} sx={{ mt: 0.5 }}>
                {/* Group Header Button */}
                <Box
                  onClick={() => toggleGroup(group.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.25,
                    py: 0.85,
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: hasActiveChild ? colors.accent : "text.primary",
                    fontWeight: hasActiveChild ? 600 : 500,
                    fontSize: "0.85rem",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.03)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    {group.icon}
                    <span>{group.title}</span>
                  </Stack>
                  {isOpen ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </Box>

                {/* Submenu Children */}
                {isOpen && (
                  <Stack spacing={0.25} sx={{ pl: 2.75, mt: 0.25 }}>
                    {group.children.map((child) => {
                      const isChildActive = location.pathname.startsWith(
                        child.path,
                      );

                      return (
                        <Box
                          key={child.path}
                          component={Link}
                          to={child.path}
                          onClick={handleLinkClick}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.25,
                            py: 0.7,
                            borderRadius: "6px",
                            textDecoration: "none",
                            color: isChildActive
                              ? colors.accent
                              : "text.secondary",
                            bgcolor: isChildActive
                              ? mode === "dark"
                                ? "rgba(99, 102, 241, 0.1)"
                                : "rgba(99, 102, 241, 0.06)"
                              : "transparent",
                            fontWeight: isChildActive ? 600 : 500,
                            fontSize: "0.8rem",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              color: "text.primary",
                              bgcolor:
                                mode === "dark"
                                  ? "rgba(255, 255, 255, 0.03)"
                                  : "rgba(0, 0, 0, 0.02)",
                            },
                          }}
                        >
                          {child.icon}
                          <span>{child.title}</span>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            );
          })}

          {/* Settings Link */}
          <Box
            component={Link}
            to="/admin/settings"
            onClick={handleLinkClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.25,
              py: 0.9,
              borderRadius: "8px",
              textDecoration: "none",
              color: isSettingsActive ? colors.accent : "text.primary",
              bgcolor: isSettingsActive
                ? mode === "dark"
                  ? "rgba(99, 102, 241, 0.12)"
                  : "rgba(99, 102, 241, 0.08)"
                : "transparent",
              fontWeight: isSettingsActive ? 600 : 500,
              fontSize: "0.85rem",
              transition: "all 0.15s ease",
              mt: 0.5,
              "&:hover": {
                bgcolor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.03)",
              },
            }}
          >
            <Settings size={18} />
            Settings
          </Box>
        </Stack>
      </Box>

      {/* 4. Footer & Profile Information */}
      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={1}>
        {/* User Card with Logout */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 1,
            borderRadius: "8px",
            bgcolor:
              mode === "dark"
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
            border: `1px solid ${colors.cardBorder}`,
          }}
        >
          <Box sx={{ overflow: "hidden", pr: 1 }}>
            <Typography
              level="body-xs"
              sx={{
                fontWeight: 700,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`
                : "admin User"}
            </Typography>
            <Typography
              level="body-xs"
              sx={{
                fontFamily: "var(--font-code, monospace)",
                fontSize: "0.68rem",
                color: colors.accent,
                textTransform: "uppercase",
              }}
            >
              {primaryRole}
            </Typography>
          </Box>

          <IconButton
            size="sm"
            variant="plain"
            color="danger"
            onClick={handleLogout}
            title="Sign Out"
            sx={{ borderRadius: "6px" }}
          >
            <LogOut size={16} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdminSidebar;
