import { useState, useMemo, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Divider,
  Chip,
} from "@mui/joy";
import {
  Building2,
  ArrowRight,
  Lock,
  Mail,
  ChevronRight,
  Key,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const ROLE_CONFIG: Record<
  string,
  {
    icon: typeof Shield;
    color: "danger" | "primary" | "warning" | "neutral";
    badgeText: string;
  }
> = {
  super_admin: {
    icon: Shield,
    color: "danger",
    badgeText: "SUPER ADMIN",
  },
  admin: {
    icon: Key,
    color: "primary",
    badgeText: "ADMINISTRATOR",
  },
  manager: {
    icon: Users,
    color: "warning",
    badgeText: "OPERATIONS",
  },
};

/**
 * Check if an account is strictly a standard user/client persona.
 * Accounts suitable for Admin operations include all accounts except the standard user.
 */
const isStandardUser = (roles: string[], emailAddress?: string): boolean => {
  if (emailAddress === "user@example.com") return true;
  if (roles.length === 0) return true;
  return roles.every((r) => r === "user");
};

export default function AdminLoginPage() {
  const { login, quickLogin, logout, demoAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, colors } = useThemeColors();

  // Default demo user: Alex Rivera (admin)
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("Password123!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const destination =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    "/admin";

  // Filter accounts suitable for Admin operations: ALL EXCEPT THE STANDARD USER
  const adminAccounts = useMemo(() => {
    return demoAccounts.filter((a) => !isStandardUser(a.roles, a.email));
  }, [demoAccounts]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await login(email, password);
      if (isStandardUser(authenticatedUser.roles, authenticatedUser.email)) {
        await logout();
        setError(
          "Access denied: Standard client accounts cannot log in to the Admin Hub. Please use the Client Portal.",
        );
        return;
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleOrEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await quickLogin(roleOrEmail);
      if (isStandardUser(authenticatedUser.roles, authenticatedUser.email)) {
        await logout();
        setError(
          "Access denied: Standard client accounts cannot log in to the Admin Hub. Please use the Client Portal.",
        );
        return;
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to authenticate account.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "background.body",
      }}
    >
      <Container
        elevation={0}
        radius="16px"
        padding="2.25rem"
        style={{
          maxWidth: 500,
          width: "100%",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow:
            mode === "dark"
              ? "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
              : "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Header Branding */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  bgcolor: "text.primary",
                  color: "background.surface",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Building2 size={22} />
              </Box>
              <Box>
                <Typography variant="header" size="xs" bold>
                  Admin Hub
                </Typography>
                <Typography
                  variant="caption"
                  size="xs"
                  color="secondary"
                  sx={{
                    letterSpacing: "0.06em",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-code, monospace)",
                  }}
                >
                  HOSPITALITY OPERATIONS CONSOLE
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="sm"
              variant="soft"
              color="warning"
              startDecorator={<Key size={13} />}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                borderRadius: "6px",
              }}
            >
              ADMIN PORTAL
            </Chip>
          </Stack>

          <Typography
            variant="body"
            size="sm"
            color="secondary"
            sx={{ mt: 0.5 }}
          >
            Authorized staff and management sign in to control room inventory,
            process check-ins, oversee bookings, and review financials.
          </Typography>
        </Stack>

        {error && (
          <Alert
            color="danger"
            variant="soft"
            sx={{
              mb: 2.5,
              borderRadius: "8px",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel
                sx={{
                  fontSize: "0.775rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                }}
              >
                Staff / Admin Email
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startDecorator={<Mail size={16} />}
                placeholder="admin@example.com"
                sx={{
                  borderRadius: "8px",
                  py: 1.1,
                  fontSize: "0.9rem",
                  bgcolor: "background.surface",
                  border:
                    "1px solid var(--joy-palette-neutral-outlinedBorder, rgba(0,0,0,0.12))",
                  "&:focus-within": {
                    borderColor: colors.accent,
                  },
                }}
              />
            </FormControl>

            <FormControl required>
              <FormLabel
                sx={{
                  fontSize: "0.775rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "text.secondary",
                }}
              >
                Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startDecorator={<Lock size={16} />}
                placeholder="Enter password"
                sx={{
                  borderRadius: "8px",
                  py: 1.1,
                  fontSize: "0.9rem",
                  bgcolor: "background.surface",
                  border:
                    "1px solid var(--joy-palette-neutral-outlinedBorder, rgba(0,0,0,0.12))",
                  "&:focus-within": {
                    borderColor: colors.accent,
                  },
                }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="solid"
              colorScheme="primary"
              disabled={isLoading}
              endDecorator={<ArrowRight size={16} />}
              sx={{
                mt: 1,
                py: 1.25,
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {isLoading ? "Authenticating..." : "Sign In to Admin Hub"}
            </Button>
          </Stack>
        </form>

        {/* 1-Click Operations Personas (All suitable accounts except user) */}
        <Divider sx={{ my: 3 }}>
          <Typography
            variant="caption"
            size="xs"
            color="secondary"
            sx={{
              fontFamily: "var(--font-code, monospace)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              px: 1,
            }}
          >
            OPERATIONAL DEMO PERSONAS
          </Typography>
        </Divider>

        <Stack spacing={1.25}>
          {adminAccounts.map((account) => {
            const primaryRole =
              account.roles.find((r) => r in ROLE_CONFIG) ||
              account.roles[0] ||
              "admin";
            const config = ROLE_CONFIG[primaryRole] || {
              icon: Building2,
              color: "neutral" as const,
              badgeText: "STAFF",
            };
            const Icon = config.icon;

            return (
              <Box
                key={account.email}
                component="button"
                type="button"
                onClick={() => handleQuickLogin(account.email)}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.25,
                  borderRadius: "10px",
                  border: `1px solid ${colors.cardBorder}`,
                  bgcolor:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: colors.accent,
                    bgcolor:
                      mode === "dark"
                        ? "rgba(99, 102, 241, 0.08)"
                        : "rgba(99, 102, 241, 0.04)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "8px",
                      bgcolor: `${config.color}.softBg`,
                      color: `${config.color}.plainColor`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body" size="xs" bold>
                        {account.first_name} {account.last_name}
                      </Typography>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={config.color}
                        sx={{
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          py: 0.1,
                          px: 0.8,
                          borderRadius: "4px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {config.badgeText}
                      </Chip>
                    </Stack>
                    <Typography
                      variant="caption"
                      size="xs"
                      color="secondary"
                      sx={{
                        fontFamily: "var(--font-code, monospace)",
                        fontSize: "0.72rem",
                      }}
                    >
                      {account.email}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography
                    variant="caption"
                    size="xs"
                    sx={{
                      fontWeight: 600,
                      color: colors.accent,
                      fontSize: "0.75rem",
                    }}
                  >
                    Select
                  </Typography>
                  <ChevronRight size={14} color={colors.accent} />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
