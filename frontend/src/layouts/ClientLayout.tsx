import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/joy";
import PublicHeader from "@/components/client/Header";
import { useThemeColors } from "@/hooks/useThemeColors";

export const ClientLayout: FC = () => {
  const { colors } = useThemeColors();
  const width = 1400;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        bgcolor: colors.dominant,
      }}
    >
      {/* Reusable Public Header */}
      <PublicHeader maxWidth={width} />

      {/* Main Public Page Content */}
      <Box component="main" sx={{ maxWidth: width, mx: "auto", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ClientLayout;
