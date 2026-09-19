import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Chip,
} from "@mui/joy";
import { User, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColors } from "@/hooks/useThemeColors";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function ClientLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mode, colors } = useThemeColors();

  // Default demo user: Elena Rostova (client/user)
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("Password123!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
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
      }}
    >
      <Container
        elevation={2}
        radius="16px"
        padding="2.25rem"
        style={{
          width: 420,
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
                  bgcolor: "primary.solidBg",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                }}
              >
                <User size={22} />
              </Box>
              <Box>
                <Typography variant="header" size="xs" bold>
                  Login
                </Typography>
              </Box>
            </Stack>

            <Chip
              size="sm"
              variant="soft"
              color="primary"
              startDecorator={<Sparkles size={13} />}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                borderRadius: "6px",
              }}
            >
              CLIENT
            </Chip>
          </Stack>

          <Typography
            variant="body"
            size="sm"
            color="secondary"
            sx={{ mt: 0.5 }}
          >
            Sign in to book a reservation.
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
                Client Email
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startDecorator={<Mail size={16} />}
                placeholder="client@example.com"
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
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
