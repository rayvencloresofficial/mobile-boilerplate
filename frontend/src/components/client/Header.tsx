import { useState, type FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, IconButton, Sheet, Drawer, Chip, Divider } from "@mui/joy";
import {
  Building2,
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
  Home,
  Info,
  ChevronRight,
} from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";

export interface PublicHeaderProps {
  maxWidth?: number | string;
}

export const PublicHeader: FC<PublicHeaderProps> = ({ maxWidth = 1400 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, setMode, colors } = useThemeColors();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const navLinks = [
    { label: "Home", path: "/", icon: <Home size={16} /> },
    { label: "About", path: "/about", icon: <Info size={16} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isCurrentActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 1. Glassmorphic Public Top Navigation Bar */}
      <Sheet
        variant="plain"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: colors.light,
          borderBottom: `1px solid ${colors.cardBorder}`,
          px: { xs: 2, sm: 3, md: 5 },
          py: 1.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ maxWidth, mx: "auto" }}
        >
          {/* Brand Logo & Name */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
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
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Building2 size={20} />
            </Box>
            <Box>
              <Typography
                variant="header"
                size="xs"
                bold
                sx={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                Brand
              </Typography>
              <Typography
                variant="caption"
                size="xs"
                color="secondary"
                sx={{
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Name
              </Typography>
            </Box>
          </Stack>

          {/* Desktop Navigation Links */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((item) => {
              const active = isCurrentActive(item.path);
              return (
                <Box
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: active ? colors.accent : "text.primary",
                    fontWeight: active ? 600 : 500,
                    fontSize: "0.85rem",
                    bgcolor: active
                      ? mode === "dark"
                        ? "rgba(99, 102, 241, 0.12)"
                        : "rgba(99, 102, 241, 0.08)"
                      : "transparent",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                    },
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Box>
              );
            })}
          </Stack>

          {/* Right Controls: Theme Toggle & User Auth Status */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              title="Toggle color theme"
              sx={{ borderRadius: "8px" }}
            >
              {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>

            {isAuthenticated ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="md"
                  variant="outlined"
                  color="primary"
                  startDecorator={<User size={14} />}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  {user?.first_name || "Elena"} ({user?.roles?.[0] || "user"})
                </Chip>
                <IconButton
                  size="sm"
                  variant="plain"
                  color="danger"
                  onClick={handleLogout}
                  title="Sign out"
                  sx={{ borderRadius: "8px" }}
                >
                  <LogOut size={16} />
                </IconButton>
              </Stack>
            ) : (
              <Button
                variant="solid"
                colorScheme="primary"
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: "8px",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  px: 2,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Drawer Trigger */}
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, borderRadius: "8px" }}
            >
              <Menu size={20} />
            </IconButton>
          </Stack>
        </Stack>
      </Sheet>

      {/* Mobile Drawer Navigation */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        size="sm"
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "primary.solidBg",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} />
            </Box>
            <Box>
              <Typography variant="header" size="xs" bold>
                Brand
              </Typography>
              <Typography variant="caption" size="xs" color="secondary">
                Name
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1} sx={{ flex: 1 }}>
            {navLinks.map((item) => {
              const active = isCurrentActive(item.path);
              return (
                <Box
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.25,
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: active ? colors.accent : "text.primary",
                    bgcolor: active
                      ? mode === "dark"
                        ? "rgba(99, 102, 241, 0.12)"
                        : "rgba(99, 102, 241, 0.08)"
                      : "transparent",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    {item.icon}
                    <span>{item.label}</span>
                  </Stack>
                  <ChevronRight size={16} />
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {isAuthenticated ? (
            <Button
              variant="outlined"
              colorScheme="error"
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              startDecorator={<LogOut size={16} />}
              fullWidth
            >
              Sign Out ({user?.email})
            </Button>
          ) : (
            <Button
              variant="solid"
              colorScheme="primary"
              onClick={() => {
                setMobileDrawerOpen(false);
                navigate("/login");
              }}
              fullWidth
            >
              Sign In
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default PublicHeader;
