import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Divider,
  Chip,
  Link,
} from "@mui/joy";
import {
  Terminal,
  ArrowRight,
  Lock,
  Mail,
  ChevronRight,
  Shield,
  Key,
  Users,
  User,
  Cpu,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const ROLE_ICONS: Record<string, typeof Shield> = {
  super_admin: Shield,
  admin: Key,
  manager: Users,
  user: User,
};

export default function DeveloperLoginPage() {
  const { login, quickLogin, demoAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, colors } = useThemeColors();

  // Default demo user: Sarah Vance (super_admin)
  const [email, setEmail] = useState<string>("superadmin@example.com");
  const [password, setPassword] = useState<string>("Password123!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const destination =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    "/dev";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
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
      await quickLogin(roleOrEmail);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to authenticate persona.",
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
          maxWidth: 520,
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
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Terminal size={22} />
              </Box>
              <Box>
                <Typography variant="header" size="xs" bold>
                  Developer Bench
                </Typography>
                <Typography
                  variant="caption"
                  size="xs"
                  color="secondary"
                  sx={{
                    fontFamily: "var(--font-code, monospace)",
                    letterSpacing: "0.06em",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                  }}
                >
                  SYSTEM ARCHITECTURE & RBAC TESTBED
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="sm"
              variant="soft"
              color="danger"
              startDecorator={<Cpu size={13} />}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                borderRadius: "6px",
                fontFamily: "var(--font-code, monospace)",
              }}
            >
              DEV CLEARANCE
            </Chip>
          </Stack>

          <Typography
            variant="body"
            size="sm"
            color="secondary"
            sx={{ mt: 0.5 }}
          >
            Engineering authentication for RBAC verification, telemetry
            auditing, access matrix mutation, and database identity testing.
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
                  fontFamily: "var(--font-code, monospace)",
                }}
              >
                Developer / Root Email
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startDecorator={<Mail size={16} />}
                placeholder="superadmin@example.com"
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
                  fontFamily: "var(--font-code, monospace)",
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
              {isLoading
                ? "Authenticating Session..."
                : "Sign In to Developer Bench"}
            </Button>
          </Stack>
        </form>

        {/* 1-Click All Personas for RBAC Bench Testing */}
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
            RBAC PERSONA SWITCHER (ONE-CLICK)
          </Typography>
        </Divider>

        <Stack spacing={1}>
          {demoAccounts.map((account) => {
            const primaryRole = account.roles[0] || "user";
            const Icon = ROLE_ICONS[primaryRole] || User;
            const isSuper = account.roles.includes("super_admin");
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
                  p: 1.1,
                  borderRadius: "8px",
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
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      bgcolor: isSuper ? "danger.softBg" : "primary.softBg",
                      color: isSuper
                        ? "danger.plainColor"
                        : "primary.plainColor",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} />
                  </Box>
                  <Box>
                    <Typography variant="body" size="xs" bold>
                      {account.first_name} {account.last_name} &bull;{" "}
                      {account.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      size="xs"
                      color="secondary"
                      sx={{
                        fontFamily: "var(--font-code, monospace)",
                        fontSize: "0.68rem",
                      }}
                    >
                      {account.email}
                    </Typography>
                  </Box>
                </Stack>

                <ChevronRight size={14} color={colors.accent} />
              </Box>
            );
          })}
        </Stack>

        {/* Portal Switcher Footer */}
        <Divider sx={{ my: 2.5 }} />

        <Stack spacing={1} alignItems="center">
          <Typography variant="caption" size="xs" color="secondary">
            Switch application portal:
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            divider={
              <Typography variant="caption" size="xs" color="secondary">
                &bull;
              </Typography>
            }
          >
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { color: colors.accent },
              }}
            >
              <User size={14} />
              Client Portal
            </Link>

            <Link
              component={RouterLink}
              to="/admin/login"
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { color: colors.accent },
              }}
            >
              <Building2 size={14} />
              Admin Hub
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
