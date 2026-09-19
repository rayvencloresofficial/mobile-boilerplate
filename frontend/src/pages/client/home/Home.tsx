import Typography from "@/components/ui/Typography";
import { Box } from "@mui/joy";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="header" size="lg" bold>
        Homepage
      </Typography>
    </Box>
  );
}
