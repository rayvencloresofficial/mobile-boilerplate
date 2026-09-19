import type { ReactNode } from "react";
import { Box, Stack, Chip } from "@mui/joy";
import { Plus, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

interface BusinessPageShellProps {
  category: string;
  title: string;
  description: string;
  icon: ReactNode;
  actionText?: string;
  onAction?: () => void;
  stats?: StatItem[];
  children?: ReactNode;
}

export default function BusinessPageShell({
  category,
  title,
  description,
  icon,
  actionText = "Add Entry",
  onAction,
  stats = [
    {
      label: "Total Records",
      value: "0",
      change: "+0% this week",
      positive: true,
    },
    {
      label: "Active Status",
      value: "Healthy",
      change: "System synchronized",
      positive: true,
    },
    {
      label: "Last Updated",
      value: "Just now",
      change: "Auto-synced",
      positive: true,
    },
  ],
  children,
}: BusinessPageShellProps) {
  const { mode, colors } = useThemeColors();

  return (
    <Stack spacing={3}>
      {/* Page Header Container */}
      <Container
        elevation={0}
        radius="12px"
        padding="1.5rem"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor:
                  mode === "dark"
                    ? "rgba(99, 102, 241, 0.12)"
                    : "rgba(99, 102, 241, 0.08)",
                color: colors.accent,
                border: `1px solid ${mode === "dark" ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.2)"}`,
              }}
            >
              {icon}
            </Box>

            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    borderRadius: "4px",
                  }}
                >
                  {category.toUpperCase()}
                </Chip>
              </Stack>
              <Typography variant="header" size="sm" bold>
                {title}
              </Typography>
              <Typography variant="body" size="xs" color="secondary">
                {description}
              </Typography>
            </Box>
          </Stack>

          {actionText && (
            <Button
              variant="solid"
              colorScheme="primary"
              onClick={onAction}
              startDecorator={<Plus size={16} />}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 2,
              }}
            >
              {actionText}
            </Button>
          )}
        </Stack>
      </Container>

      {/* KPI Stats Overview */}
      {stats && stats.length > 0 && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          {stats.map((stat, idx) => (
            <Container
              key={idx}
              elevation={0}
              radius="10px"
              padding="1.25rem"
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <Typography
                variant="caption"
                size="xs"
                color="secondary"
                bold
                sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                {stat.label}
              </Typography>
              <Typography variant="header" size="md" bold sx={{ my: 0.5 }}>
                {stat.value}
              </Typography>
              {stat.change && (
                <Typography variant="caption" size="xs" color="secondary">
                  {stat.change}
                </Typography>
              )}
            </Container>
          ))}
        </Stack>
      )}

      {/* Main Workspace Area / Empty State */}
      {children ? (
        children
      ) : (
        <Container
          elevation={0}
          radius="12px"
          padding="3.5rem 2rem"
          style={{
            backgroundColor: colors.surface,
            border: `1px dashed ${colors.cardBorder}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.03)",
              color: "text.secondary",
              mb: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="header" size="xs" bold sx={{ mb: 0.5 }}>
            {title} Module Ready
          </Typography>
          <Typography
            variant="body"
            size="xs"
            color="secondary"
            sx={{ maxWidth: 460, mb: 2.5 }}
          >
            This section is connected to the business router with working
            authentication. Backend database models and business handlers can
            now be built on top of this view.
          </Typography>
          <Button
            variant="outlined"
            onClick={onAction}
            endDecorator={<ArrowRight size={15} />}
            sx={{ borderRadius: "8px", fontSize: "0.85rem" }}
          >
            Configure {title}
          </Button>
        </Container>
      )}
    </Stack>
  );
}
