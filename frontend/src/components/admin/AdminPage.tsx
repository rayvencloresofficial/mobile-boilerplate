import type { ReactNode } from "react";

import { Stack } from "@mui/joy";

interface AdminPageProps {
  children?: ReactNode;
}

export default function AdminPage({ children }: AdminPageProps) {
  return <Stack spacing={2}>{children}</Stack>;
}
