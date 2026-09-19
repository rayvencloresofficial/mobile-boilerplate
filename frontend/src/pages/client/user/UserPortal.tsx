import { Box, Stack, Chip, Divider } from "@mui/joy";
import {
  User,
  Calendar,
  Clock,
  CreditCard,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function UserPortal() {
  const { user, logout } = useAuth();
  const { mode, colors } = useThemeColors();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "background.body",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        {/* Welcome Header */}
        <Container
          elevation={0}
          radius="16px"
          padding="2rem"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.cardBorder}`,
            marginBottom: "1.5rem",
            boxShadow:
              mode === "dark"
                ? "0 12px 32px -8px rgba(0, 0, 0, 0.4)"
                : "0 12px 32px -8px rgba(0, 0, 0, 0.05)",
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
                  width: 56,
                  height: 56,
                  borderRadius: "14px",
                  bgcolor: "primary.softBg",
                  color: "primary.plainColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                }}
              >
                <User size={28} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="header" size="md" bold>
                    Welcome back, {user?.first_name || "Guest"}!
                  </Typography>
                  <Chip size="sm" variant="soft" color="primary">
                    CLIENT MEMBER
                  </Chip>
                </Stack>
                <Typography variant="body" size="sm" color="secondary">
                  {user?.email} &bull; Personal guest portal and reservation
                  details
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              colorScheme="secondary"
              onClick={() => logout()}
              startDecorator={<LogOut size={16} />}
              sx={{ borderRadius: "8px" }}
            >
              Sign Out
            </Button>
          </Stack>
        </Container>

        {/* Quick Highlights Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <Container
            elevation={0}
            radius="12px"
            padding="1.5rem"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" size="xs" color="secondary">
                  UPCOMING RESERVATION
                </Typography>
                <Calendar size={18} color={colors.accent} />
              </Stack>
              <Typography variant="header" size="sm" bold>
                Deluxe Ocean Suite
              </Typography>
              <Typography variant="body" size="xs" color="secondary">
                Check-in: Sept 12 &bull; 3 Nights
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                color="success"
                sx={{ alignSelf: "flex-start" }}
              >
                Confirmed
              </Chip>
            </Stack>
          </Container>

          <Container
            elevation={0}
            radius="12px"
            padding="1.5rem"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" size="xs" color="secondary">
                  MEMBERSHIP STATUS
                </Typography>
                <Sparkles size={18} color={colors.accent} />
              </Stack>
              <Typography variant="header" size="sm" bold>
                Gold Privileges
              </Typography>
              <Typography variant="body" size="xs" color="secondary">
                2,450 Points Earned
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                color="warning"
                sx={{ alignSelf: "flex-start" }}
              >
                Complimentary Breakfast
              </Chip>
            </Stack>
          </Container>

          <Container
            elevation={0}
            radius="12px"
            padding="1.5rem"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" size="xs" color="secondary">
                  PAYMENT ON FILE
                </Typography>
                <CreditCard size={18} color={colors.accent} />
              </Stack>
              <Typography variant="header" size="sm" bold>
                Mastercard ending 4921
              </Typography>
              <Typography variant="body" size="xs" color="secondary">
                Expires 08/28 &bull; Verified
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                color="neutral"
                sx={{ alignSelf: "flex-start" }}
              >
                Default Billing
              </Chip>
            </Stack>
          </Container>
        </Box>

        {/* Detailed Reservation Information */}
        <Container
          elevation={0}
          radius="16px"
          padding="2rem"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.cardBorder}`,
          }}
        >
          <Typography variant="header" size="sm" bold sx={{ mb: 1 }}>
            Reservation Details & Amenities
          </Typography>
          <Typography variant="body" size="sm" color="secondary" sx={{ mb: 3 }}>
            Review your itinerary, digital room key access, and special
            requests.
          </Typography>

          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{
                p: 2,
                borderRadius: "10px",
                bgcolor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Clock size={20} color={colors.accent} />
                <Box>
                  <Typography variant="body" size="xs" bold>
                    Early Check-in Request
                  </Typography>
                  <Typography variant="caption" size="xs" color="secondary">
                    Requested for 1:00 PM arrival
                  </Typography>
                </Box>
              </Stack>
              <Chip size="sm" variant="soft" color="primary">
                Pending Approval
              </Chip>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button variant="outlined" colorScheme="secondary">
                Modify Reservation
              </Button>
              <Button variant="solid" colorScheme="primary">
                Contact Concierge
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
