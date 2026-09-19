import { useNavigate } from "react-router-dom";
import { Box, Stack, Divider } from "@mui/joy";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container
        elevation={0}
        radius="12px"
        padding="2.5rem"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "var(--joy-palette-background-surface, #ffffff)",
          border:
            "1px solid var(--joy-palette-neutral-outlinedBorder, rgba(0,0,0,0.1))",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "10px",
              bgcolor: "text.primary",
              color: "background.surface",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={28} />
          </Box>

          <Box>
            <Typography
              variant="caption"
              align="center"
              color="error"
              size="sm"
              bold
            >
              403 Forbidden &bull; Clearance Required
            </Typography>
            <Typography
              variant="caption"
              size="xs"
              align="center"
              sx={{ mt: 0.5, display: "block", opacity: 0.6 }}
            >
              Your account identity does not possess the requisite clearance to
              access this resource.
            </Typography>
          </Box>

          <Divider sx={{ width: "100%", my: 0.5 }} />

          <Button
            variant="plain"
            colorScheme="secondary"
            onClick={() => navigate("/")}
            startDecorator={<ArrowLeft size={14} />}
            sx={{ mt: 1, fontSize: "0.8rem" }}
          >
            Return to Homepage
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
