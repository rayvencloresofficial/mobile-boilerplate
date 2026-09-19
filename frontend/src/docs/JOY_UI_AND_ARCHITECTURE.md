# Joy UI Design System & Frontend Architecture Guide

This comprehensive guide outlines the architectural standards, directory structure, Joy UI integration rules, and component usage patterns used across the **Boilerplate** frontend application.

---

## Table of Contents

1. [Architectural Overview & Monorepo Context](#1-architectural-overview--monorepo-context)
2. [Frontend Directory Structure](#2-frontend-directory-structure)
3. [Component Hierarchy & Priority Rules](#3-component-hierarchy--priority-rules)
4. [Theme, Colors & Dark Mode System](#4-theme-colors--dark-mode-system)
5. [Core Custom UI Wrappers (`src/components/ui/`)](#5-core-custom-ui-wrappers)
   - [Container (`<Container />`)](#51-container-use-instead-of-card)
   - [Typography (`<Typography />`)](#52-typography)
   - [Button (`<Button />`)](#53-button)
   - [Calendar (`<Calendar />`)](#54-calendar)
6. [Standard Joy UI Components & Implementation Patterns](#6-standard-joy-ui-components--patterns)
7. [Authentication, Authorization & Routing](#7-authentication-authorization--routing)
8. [Code Quality & Fast Refresh Hygiene](#8-code-quality--fast-refresh-hygiene)

---

## 1. Architectural Overview & Monorepo Context

The application is structured as a unified, full-stack monorepo consisting of:
- **`frontend/`**: Vite + React 19 SPA serving three distinct functional portals (**Client**, **Admin Hub**, and **Developer Bench**).
- **`backend/`**: Express + TypeScript REST API providing authentication, RBAC, user management, and operational endpoints.
- **`database/`**: Standalone PostgreSQL DDL migrations and seeders (Kysely query builder at runtime).

### The Three Frontend Portals
The single frontend SPA serves three isolated portal interfaces under unified session management:
1. **Client / Public Portal (`/`, `/about`, `/login`, `/portal`)**:
   - Guest booking, public marketing, and authenticated customer reservation management.
   - Guarded by `<ProtectedRoute loginPath="/login" />`.
2. **Admin Operations Hub (`/admin/*`)**:
   - Hospitality staff management: Room Inventory, Check-Ins, Bookings, Financials, Dynamic Pricing, and Staff Management.
   - Guarded by `<ProtectedRoute loginPath="/admin/login" requiredRole={["super_admin", "admin", "manager"]} />`.
3. **Developer Bench (`/dev/*`)**:
   - System internals, live RBAC testing pad, permission matrices, user administration, and system diagnostics.
   - Guarded by `<ProtectedRoute loginPath="/dev/login" />` with fine-grained permission gates (e.g. `users:read`, `roles:read`).

---

## 2. Frontend Directory Structure

```
frontend/src/
├── assets/                  # Static media, icons, branding SVGs
├── components/              # Shared component library
│   ├── admin/               # Admin Hub UI (AdminSidebar, topbars, modals)
│   ├── client/              # Public/Guest UI (Header, GuestNav, Hero banners)
│   ├── devs/                # Developer Bench UI (DevSidebar, Testpad widgets)
│   ├── styles/              # Global component CSS (container.css, animations)
│   ├── theme/               # Theme & typography interactive settings drawers
│   └── ui/                  # Primary Design System Wrappers (Container, Typography, Button, Calendar)
│       └── docs/            # Component-specific markdown references
├── constants/               # Immutable configurations (demo credentials, navigation items)
├── context/                 # React Contexts & Providers (Auth, Theme, Typography)
├── docs/                    # Architectural & design system documentation
├── hooks/                   # Custom application hooks (useAuth, useThemeColors, useTypography)
├── layouts/                 # Page scaffolding shells (AdminLayout, ClientLayout, DeveloperLayout, AuthLayout)
├── pages/                   # Route view controllers organized by portal domain
│   ├── admin/               # Admin pages (dashboard, rooms, bookings, financials, staff)
│   ├── auth/                # Dedicated login portals (client, admin, developer)
│   ├── client/              # Guest pages (home, about, user/UserPortal)
│   ├── developer/           # Dev bench pages (testpad, dashboard, users, roles, settings)
│   ├── Forbidden.tsx        # 403 Access Denied view
│   ├── NotFound.tsx         # 404 Route Not Found view
│   └── Unauthorized.tsx     # 403 RBAC Clearance Required view
├── routes/                  # Modular routing trees & guards
│   ├── Routes.tsx           # Master AppRoutes orchestrator
│   ├── AdminRoutes.tsx      # Admin operational sub-router (/admin/*)
│   ├── ClientRoutes.tsx     # Client & Public sub-router (/*)
│   ├── DeveloperRoutes.tsx  # Developer Bench sub-router (/dev/*)
│   ├── ProtectedRoute.tsx   # Role & permission route barrier
│   └── PermissionGate.tsx   # Inline component authorization gate
├── services/                # Type-safe API communication clients
│   ├── api.ts               # Base Axios client with automatic Bearer token & refresh interception
│   ├── auth.api.ts          # Authentication endpoints (/auth/login, /auth/demo-accounts, etc.)
│   ├── rbac.api.ts          # User, role, and permission REST calls
│   └── settings.api.ts      # Global application settings client
├── types/                   # TypeScript interfaces (auth, api, database, models)
├── utils/                   # Pure helper functions (Colors, Fonts, Format, Scale, ScrollToTop)
├── App.tsx                  # Root application component mounting providers and router
├── index.css                # Global CSS resets, CSS custom properties, and scrollbar styles
└── main.tsx                 # Application entry point with Joy UI CssVarsProvider & scale auto-fix
```

---

## 3. Component Hierarchy & Priority Rules

When creating or modifying UI elements, **always follow this strict priority order**:

```
┌────────────────────────────────────────────────────────────┐
│ 1. Local UI Wrappers (`src/components/ui/`)                 │
│    Container, Typography, Button, Calendar                 │
└────────────────────────────┬───────────────────────────────┘
                             │ (Fallback when wrapper does not exist)
                             ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Joy UI (`@mui/joy`)                                     │
│    Input, FormControl, Chip, Modal, Table, Stack, Box, etc.│
└────────────────────────────┬───────────────────────────────┘
                             │ (Fallback ONLY for pickers not in Joy UI)
                             ▼
┌────────────────────────────────────────────────────────────┐
│ 3. MUI Material (`@mui/material`)                          │
│    Strictly reserved for specialized pickers when needed   │
└────────────────────────────────────────────────────────────┘
```

### Golden Rules:
1. **Never use Joy UI `<Card>` directly**: Always use the local **`<Container>`** wrapper (`@/components/ui/Container`). It provides built-in elevation shadows, theme-aware surface borders, hover interactions, and responsive clamping.
2. **Never use raw HTML `<button>` or `<p>`/`<span>`**: Use `<Button>` and `<Typography>` for consistent typography scaling, accessible states, and color harmony.
3. **Use Joy UI semantic tokens**: Prefer `color="primary"`, `variant="soft"`, `bgcolor: "background.surface"`, and `border: "1px solid var(--joy-palette-neutral-outlinedBorder)"` over raw hardcoded HEX codes like `#ffffff` or `#000000`.

---

## 4. Theme, Colors & Dark Mode System

The project features a **dynamic theme system** integrating Joy UI's `CssVarsProvider` with local HSL color tokens.

### Accessing Theme Tokens
Always consume the theme via the custom hook `useThemeColors()`:

```tsx
import { useThemeColors } from "@/hooks/useThemeColors";

export default function MyComponent() {
  const { mode, setMode, colors } = useThemeColors();

  return (
    <Box
      sx={{
        bgcolor: colors.surface,
        border: `1px solid ${colors.cardBorder}`,
        color: colors.dominant,
      }}
    >
      Current Theme Mode: {mode}
    </Box>
  );
}
```

### Key Theme Color Tokens (`colors.*`)
| Token Name | Description | Default Light | Default Dark |
| :--- | :--- | :--- | :--- |
| `colors.primary` | Primary brand accent color (alias for `colors.accent`) | `#0284c7` (Sky) | `#38bdf8` |
| `colors.accent` | Vivid focal point highlight / CTA action color | Dynamic Accent | Dynamic Accent |
| `colors.surface` | Card & container surface | `#ffffff` | `#11131a` |
| `colors.cardBorder` | Subtle border delimiter | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |
| `colors.dominant` | Neutral background canvas (alias: `colors.background`) | `#f8fafc` (Slate 50) | `#0b0f19` (Slate 950) |
| `colors.secondary` | Structural headers, borders, secondary text | `#334155` (Slate 700) | `#94a3b8` (Slate 400) |
| `colors.textPrimary` | Main body text | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) |
| `colors.textSecondary` | Muted / description text | `#334155` | `#94a3b8` |
| `colors.success` | Positive status indicator | `#28a745` | `#2ecc71` |
| `colors.error` | Destructive / error indicator | `#c70030` | `#ff4757` |
| `colors.warning` | Alert / maintenance indicator | `#ff4545` | `#ff6b6b` |
| `colors.info` | Informational indicator | `#5BC0DE` | `#74d4f5` |

---

### 4.1 How to Use the `Colors.ts` Utility (`src/utils/Colors.ts`)

The **Colors Utility** (`src/utils/Colors.ts`) is the single source of truth for color generation, preset management, and CSS synchronization.

#### 1. Consuming in React Components (Standard Pattern)
Inside any component, use the `useThemeColors()` hook:

```tsx
import { useThemeColors } from "@/hooks/useThemeColors";

export function StatsCard() {
  const { colors, mode } = useThemeColors();

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.cardBorder}`,
        color: colors.textPrimary,
      }}
    >
      Active Theme: {mode}
    </div>
  );
}
```

#### 2. Querying Colors Directly (`getColors`)
For utilities, non-React modules, chart series, or PDF generation, import `getColors`:

```tsx
import { getColors } from "@/utils/Colors";

// Returns the full token dictionary for light or dark mode
const lightTokens = getColors("light");
const darkTokens = getColors("dark");

export const chartColors = [
  lightTokens.primary,
  lightTokens.secondary,
  lightTokens.success,
  lightTokens.warning,
];
```

#### 3. Switching Theme Presets Programmatically (`setThemePreset`)
The application includes 8 built-in curated presets: `modern-azure` (default), `sunset-terracotta`, `emerald-sanctuary`, `royal-indigo`, `island-amber`, `tropical-coral`, `forest-pine`, and `plum-orchid`.

```tsx
import { setThemePreset, getThemePresets, getActiveThemePresetId } from "@/utils/Colors";

export function ThemePicker() {
  const activeId = getActiveThemePresetId();
  const presets = getThemePresets();

  return (
    <select value={activeId} onChange={(e) => setThemePreset(e.target.value)}>
      {presets.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
```

#### 4. Applying Dynamic Color Overrides (`setCustomThemeColors`)
Customize specific palette tokens at runtime (e.g. user-defined branding):

```tsx
import { setCustomThemeColors } from "@/utils/Colors";

// Custom light mode brand accent
setCustomThemeColors("light", {
  accent: "#2563eb",
  surface: "#ffffff",
});
```

#### 5. Hover Alpha Helper (`hoverColor`)
Generates an 80% opacity hex string (`CC`) for hover and pressed states:

```tsx
import { hoverColor } from "@/utils/Colors";

const primaryHover = hoverColor("#0284c7"); // "#0284c7CC"
```

> [!TIP]
> For the complete API reference, color tables, and CSS variable mapping details, see the dedicated [Colors Utility Guide](./COLORS_GUIDE.md).

---

## 5. Core Custom UI Wrappers

### 5.1 Container (`<Container />`)
**Path**: `src/components/ui/Container.tsx`  
**Purpose**: Replaces standard cards, boxes, and surface panels with built-in elevation shadows, smooth micro-interactions, responsive padding, and border tokens.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `elevation` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | CSS box-shadow depth level |
| `variant` | `"filled" \| "outlined"` | `"filled"` | Surface style |
| `padding` | `string` | `clamp(...)` | Responsive internal padding |
| `radius` | `string` | `"0.5rem"` | Border radius (e.g. `"12px"`, `"16px"`) |
| `direction` | `"row" \| "column"` | `"column"` | Flexbox layout direction |
| `gap` | `string` | `clamp(...)` | Gap between flex children |
| `hover` | `boolean` | `false` | Enables interactive hover micro-animations |
| `hoverEffect` | `"lift" \| "glow" \| "scale" \| "highlight" \| "shadow-expand"` | `"lift"` | Visual hover behavior |
| `animation` | `"fade-in" \| "slide-up" \| "zoom-in" \| ...` | `undefined` | Entrance keyframe animation |
| `disabled` | `boolean` | `false` | Disables clicks and sets `cursor: not-allowed` |

#### Usage Example:
```tsx
import Container from "@/components/ui/Container";
import Typography from "@/components/ui/Typography";
import { useThemeColors } from "@/hooks/useThemeColors";

export function RoomCard({ title, price }: { title: string; price: string }) {
  const { colors } = useThemeColors();

  return (
    <Container
      elevation={0}
      radius="14px"
      padding="1.5rem"
      hover
      hoverEffect="lift"
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.cardBorder}`,
      }}
    >
      <Typography variant="header" size="sm" bold>
        {title}
      </Typography>
      <Typography variant="body" size="xs" color="secondary">
        Nightly Rate: {price}
      </Typography>
    </Container>
  );
}
```

---

### 5.2 Typography (`<Typography />`)
**Path**: `src/components/ui/Typography.tsx`  
**Purpose**: Wraps Joy UI Typography with fluid `clamp()` font scaling, standardized semantic variants, and theme-aware color mapping.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"title" \| "header" \| "subtitle" \| "body" \| "label" \| "caption"` | `"body"` | Semantic typographical purpose |
| `size` | `"xs" \| "sm" \| "normal" \| "md" \| "lg"` | `"normal"` | Responsive scale size |
| `color` | `"primary" \| "secondary" \| "dominant" \| "accent" \| "error" \| "warning" \| "success"` | `"default"` | Semantic text palette color |
| `bold` | `boolean` | `false` | Applies `fontWeight: 700` |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |
| `underline` | `boolean` | `false` | Applies underline decoration |
| `italicized` | `boolean` | `false` | Applies italic styling |

#### Usage Example:
```tsx
import Typography from "@/components/ui/Typography";

export function PageHeader() {
  return (
    <div>
      <Typography variant="title" size="md" bold>
        Hotel Room Inventory
      </Typography>
      <Typography variant="body" size="sm" color="secondary">
        Manage live suite availability, pricing tiers, and maintenance schedules.
      </Typography>
    </div>
  );
}
```

---

### 5.3 Button (`<Button />`)
**Path**: `src/components/ui/Button.tsx`  
**Purpose**: Extends Joy UI's Button with local theme color integration (`colorScheme`), custom variants, and icon decorators.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"solid" \| "outlined" \| "soft" \| "plain"` | `"solid"` | Joy UI button variant style |
| `colorScheme` | `"primary" \| "secondary" \| "accent" \| "surface" \| "success" \| "warning" \| "error"` | `"primary"` | Local design system palette key |
| `startDecorator` | `ReactNode` | `undefined` | Leading icon element |
| `endDecorator` | `ReactNode` | `undefined` | Trailing icon element |
| `disabled` | `boolean` | `false` | Disabled interaction state |

#### Usage Example:
```tsx
import Button from "@/components/ui/Button";
import { Plus, ArrowRight } from "lucide-react";

export function ActionButtonGroup() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button
        variant="solid"
        colorScheme="primary"
        startDecorator={<Plus size={16} />}
        onClick={() => console.log("New Room")}
      >
        Add Room
      </Button>

      <Button
        variant="outlined"
        colorScheme="secondary"
        endDecorator={<ArrowRight size={16} />}
      >
        View Financials
      </Button>
    </div>
  );
}
```

---

### 5.4 Calendar (`<Calendar />`)
**Path**: `src/components/ui/Calendar.tsx`  
**Purpose**: High-performance hospitality reservation calendar supporting single-date or range selection, occupancy indicators, custom event statuses, and pricing overrides.

#### Component Props:
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selectionMode` | `"range" \| "single"` | `"range"` | Selection behavior |
| `startDate` | `string \| null` | `null` | Start date in `YYYY-MM-DD` |
| `endDate` | `string \| null` | `null` | End date in `YYYY-MM-DD` |
| `onChange` | `(range: DateRange) => void` | `undefined` | Fired on date selection |
| `events` | `CalendarEvent[]` | `[]` | Status dots (Available, Occupied, Maintenance) |
| `legendItems` | `CalendarLegendItem[]` | `[]` | Legend items displayed at bottom |

#### Usage Example:
```tsx
import { useState } from "react";
import Calendar, { type DateRange } from "@/components/ui/Calendar";

export function RoomBookingPicker() {
  const [range, setRange] = useState<DateRange>({
    startDate: "2026-09-12",
    endDate: "2026-09-15",
    nights: 3,
  });

  return (
    <Calendar
      selectionMode="range"
      startDate={range.startDate}
      endDate={range.endDate}
      onChange={(newRange) => setRange(newRange)}
      legendItems={[
        { label: "Available", color: "#10b981" },
        { label: "Occupied", color: "#ef4444" },
      ]}
    />
  );
}
```

---

## 6. Standard Joy UI Components & Patterns

For components where no local wrapper is required (e.g. form inputs, tables, modals, chips), import directly from **`@mui/joy`**:

### 6.1 Form Controls (`Input`, `FormControl`, `FormLabel`)
Always combine `FormControl` and `FormLabel` with Joy UI's `Input`:

```tsx
import { FormControl, FormLabel, Input } from "@mui/joy";
import { Mail } from "lucide-react";

<FormControl required>
  <FormLabel sx={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    Email Address
  </FormLabel>
  <Input
    type="email"
    placeholder="user@example.com"
    startDecorator={<Mail size={16} />}
    sx={{ borderRadius: "8px" }}
  />
</FormControl>
```

### 6.2 Status Badges (`Chip`)
Use Joy UI's `<Chip>` for status indicators:

```tsx
import { Chip } from "@mui/joy";

<Chip size="sm" variant="soft" color="success">
  CONFIRMED
</Chip>

<Chip size="sm" variant="soft" color="danger">
  CANCELLED
</Chip>

<Chip size="sm" variant="soft" color="warning">
  MAINTENANCE
</Chip>
```

### 6.3 Flex Layouts (`Stack` & `Box`)
Use `<Stack>` and `<Box>` for semantic layouts without arbitrary CSS floats:

```tsx
import { Stack, Box, Divider } from "@mui/joy";

<Stack direction="row" spacing={2} alignItems="center" divider={<Divider orientation="vertical" />}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>
```

---

## 7. Authentication, Authorization & Routing

### 7.1 Protected Route Guards (`<ProtectedRoute />`)
All routes are guarded using `<ProtectedRoute />` in `src/routes/`:

```tsx
import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Dashboard from "@/pages/admin/dashboard/Dashboard";

// 1. Role-guarded route (Super Admin, Admin, or Manager)
<Route
  element={
    <ProtectedRoute
      loginPath="/admin/login"
      requiredRole={["super_admin", "admin", "manager"]}
    />
  }
>
  <Route path="dashboard" element={<Dashboard />} />
</Route>

// 2. Fine-grained permission-guarded route
<Route
  path="users"
  element={
    <ProtectedRoute loginPath="/dev/login" requiredPermission="users:read">
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### 7.2 Programmatic Authorization (`useAuth`)
Evaluate permissions conditionally inside components using `useAuth()`:

```tsx
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const { hasPermission } = useAuth();

  if (!hasPermission("users:delete")) {
    return null; // Hidden if user lacks clearance
  }

  return (
    <Button colorScheme="error" onClick={onConfirm}>
      Delete Record
    </Button>
  );
}
```

---

## 8. Code Quality & Fast Refresh Hygiene

1. **Fast Refresh Rule**: Files exporting React components must **only export React components** (`react-refresh/only-export-components`).
   - Keep types in `src/types/` or separate `.ts` files.
   - Keep helper functions in `src/utils/`.
   - Keep hooks in `src/hooks/`.
2. **API Communication**: Components never make raw `fetch` calls. All HTTP communication goes through type-safe service wrappers in `src/services/*.api.ts`.
3. **Strict TypeScript**: Zero `any` types. Maximize type safety with interfaces and discriminated unions.
4. **Vite Inspect**: In development mode, developers can visit `http://localhost:5173/__inspect/` to examine Vite plugins, module transforms, and HMR pipelines.
