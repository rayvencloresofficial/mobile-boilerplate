import type { FC } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { Box, Stack, IconButton, Link } from "@mui/joy";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useThemeColors } from "../hooks/useThemeColors";

export const AuthLayout: FC = () => {
  const { mode, setMode } = useThemeColors();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top Navbar */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, sm: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:
            mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.06)",
          bgcolor:
            mode === "dark"
              ? "rgba(17, 19, 26, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
              fontWeight: 600,
              fontSize: "0.9rem",
              "&:hover": { color: "primary.main" },
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              height: 16,
              width: "1px",
              bgcolor: "divider",
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Theme Toggle */}
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            title="Toggle color mode"
            sx={{
              borderRadius: "8px",
              minHeight: 36,
              minWidth: 36,
              border:
                "1px solid var(--joy-palette-neutral-outlinedBorder, rgba(0,0,0,0.12))",
            }}
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>
        </Stack>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
