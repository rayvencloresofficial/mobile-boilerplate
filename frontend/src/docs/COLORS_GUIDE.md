# Colors Utility Guide (`src/utils/Colors.ts`)

The **Colors Utility** (`src/utils/Colors.ts`) is the single source of truth for all color tokens, theme palettes, and dark mode adaptations across the application. It dynamically coordinates with Joy UI's `CssVarsProvider`, local component wrappers, and CSS custom properties.

---

## 1. Core Triad Design Philosophy

Rather than using arbitrary hex codes, the design system is built around a cohesive **Color Triad**:

| Role | Token Name | Purpose | Example (Light / Dark) |
| :--- | :--- | :--- | :--- |
| **Canvas** | `colors.dominant` (or `colors.background`) | Neutral background canvas | `#f8fafc` (Slate 50) / `#0b0f19` (Dark Slate) |
| **Structure** | `colors.secondary` | Structural headers, borders, secondary text | `#334155` (Slate 700) / `#94a3b8` (Slate 400) |
| **Action** | `colors.accent` (or `colors.primary`) | Call-to-action buttons, active badges, highlights | `#0284c7` (Sky 600) / `#38bdf8` (Sky 400) |
| **Surface** | `colors.surface` | Card surfaces, modals, popovers | `#ffffff` / `#111827` (Gray 900) |
| **Delimiter**| `colors.cardBorder` | Thin translucent borders | `rgba(0,0,0,0.08)` / `rgba(255,255,255,0.08)` |

---

## 2. Consuming Colors in Components

### Method A: Via the `useThemeColors()` Hook (Recommended)
This is the standard and recommended way inside any React component. It automatically re-renders when the user toggles dark/light mode or switches the active theme preset.

```tsx
import { Box } from "@mui/joy";
import { useThemeColors } from "@/hooks/useThemeColors";
import Typography from "@/components/ui/Typography";

export function SummaryCard() {
  const { mode, setMode, colors } = useThemeColors();

  return (
    <Box
      sx={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: "12px",
        p: 2.5,
      }}
    >
      <Typography variant="header" size="sm" bold>
        Revenue Analytics
      </Typography>
      <Typography variant="caption" size="xs" color="secondary">
        Active Mode: {mode.toUpperCase()}
      </Typography>
    </Box>
  );
}
```

### Method B: Direct Function Call via `getColors(mode)`
Use `getColors()` when querying color tokens outside of React component render cycles (e.g. utility helpers, chart configurations, PDF generation, canvas drawing):

```tsx
import { getColors } from "@/utils/Colors";

// Fetch tokens for a specific mode
const lightTokens = getColors("light");
const darkTokens = getColors("dark");

// Chart.js / MUI X-Charts series styling
export const chartSeriesColors = [
  lightTokens.primary,
  lightTokens.secondary,
  lightTokens.success,
  lightTokens.warning,
];
```

---

## 3. Available Color Tokens Reference

When inspecting `colors` (from `useThemeColors()` or `getColors(mode)`), the following keys are always available:

```typescript
{
  // 1. Core Triad & Surfaces
  dominant: string;       // Canvas background
  background: string;     // Alias for dominant
  secondary: string;      // Structural elements & secondary text
  accent: string;         // Primary action / CTA highlight
  primary: string;        // Alias for accent
  surface: string;        // Card & container surface
  cardBorder: string;     // Theme-aware translucent border
  
  // 2. Text Tokens
  textPrimary: string;    // Main body text color
  textSecondary: string;  // Secondary/muted text
  textMuted: string;      // Low-contrast captions
  
  // 3. Semantic Status Tokens
  success: string;        // Green indicator (#28a745 / #2ecc71)
  error: string;          // Red indicator (#c70030 / #ff4757)
  warning: string;        // Orange/yellow indicator (#ff4545 / #ff6b6b)
  info: string;           // Cyan/blue informational (#5BC0DE / #74d4f5)

  // 4. Utility Colors
  white: "#ffffff";
  black: "#1a1a1a";
  transparent: "transparent";
  transparentWhite: string; // 10% or 50% opacity white
  transparentBlack: string; // 50% opacity black
  light: string;            // Light surface variant
  dark: string;             // Dark surface variant
}
```

---

## 4. Built-in Theme Presets

The application ships with **8 curated theme presets** (`THEME_COLOR_PRESETS`). Each preset defines carefully balanced light and dark variants:

| Preset ID | Display Name | Accent Tone | Description |
| :--- | :--- | :--- | :--- |
| `modern-azure` *(Default)* | **Ocean Azure** | Electric Azure (`#0284c7`) | Slate canvas, navy structural headers, electric azure CTAs. |
| `sunset-terracotta` | **Sunset Terracotta** | Terracotta Orange (`#da5019`) | Warm ivory, stone bronze structure, bold terracotta orange. |
| `emerald-sanctuary` | **Emerald Lagoon** | Radiant Emerald (`#059669`) | Sage mint canvas, deep pine structure, radiant emerald highlights. |
| `royal-indigo` | **Royal Indigo** | Violet Indigo (`#4f46e5`) | Pearl lavender, midnight indigo headers, electric indigo CTAs. |
| `island-amber` | **Island Amber** | Sunrise Amber (`#d97706`) | Sand neutral canvas, dark espresso headers, warm amber gold. |
| `tropical-coral` | **Tropical Coral** | Dynamic Coral (`#e11d48`) | Porcelain blush canvas, dark garnet headers, crimson coral. |
| `forest-pine` | **Forest Pine** | Spring Green (`#15803d`) | Crisp mint off-white, deep evergreen structure, vivid green. |
| `plum-orchid` | **Plum Orchid** | Neon Orchid (`#9333ea`) | Lavender pearl canvas, midnight plum structure, luminous orchid. |

---

## 5. Preset Management & Dynamic Customization APIs

### Switching Presets Programmatically
Call `setThemePreset(presetId, mode)` to change the global theme. It automatically updates `localStorage`, injects dynamic CSS rules, and broadcasts a window event:

```tsx
import { setThemePreset, getThemePresets, getActiveThemePresetId } from "@/utils/Colors";

export function ThemePresetPicker() {
  const currentPresetId = getActiveThemePresetId();
  const presets = getThemePresets();

  return (
    <select
      value={currentPresetId}
      onChange={(e) => setThemePreset(e.target.value)}
    >
      {presets.map((preset) => (
        <option key={preset.id} value={preset.id}>
          {preset.name}
        </option>
      ))}
    </select>
  );
}
```

### Applying Custom Color Overrides
Fine-tune specific colors (e.g. brand customization) at runtime without losing preset defaults:

```tsx
import { setCustomThemeColors } from "@/utils/Colors";

// Override accent color for light mode
setCustomThemeColors("light", {
  accent: "#2563eb", // Custom Royal Blue
  surface: "#ffffff",
});

// Override dominant background for dark mode
setCustomThemeColors("dark", {
  dominant: "#05070a", // Deep OLED Black
});
```

### Hover State Helper (`hoverColor`)
Generate an 80% opacity hover variant of any hex color:

```tsx
import { hoverColor } from "@/utils/Colors";

const primary = "#0284c7";
const primaryHover = hoverColor(primary); // Output: "#0284c7CC"
```

---

## 6. How Colors Synchronize with CSS Custom Properties

`Colors.ts` automatically maintains real-time CSS variables on `:root` and `[data-joy-color-scheme]`:

```css
/* Automatically injected by Colors.ts */
:root {
  --color-dominant: #f8fafc;
  --color-secondary: #334155;
  --color-accent: #0284c7;
  --color-primary: #0284c7;
  --color-surface: #ffffff;
  
  /* Joy UI Palette overrides */
  --joy-palette-primary-500: #0284c7;
  --joy-palette-primary-solidBg: #0284c7;
  --joy-palette-background-surface: #ffffff;
  --joy-palette-background-body: #f8fafc;
}
```

This ensures that standard Joy UI components (`Input`, `Chip`, `Button`, `Modal`) naturally reflect the active theme preset without any manual per-component overrides.

---

## 7. Golden Rules for Developers

1. **Never hardcode hex values in component styling**:
   - ❌ `bgcolor: "#ffffff"`, `color: "#000000"`
   - ✅ `bgcolor: colors.surface`, `color: colors.dominant`
2. **Always use `cardBorder` for card outlines**:
   - ✅ `border: '1px solid ' + colors.cardBorder` &mdash; automatically renders light gray in light mode and subtle translucent white in dark mode.
3. **Prefer `useThemeColors()` inside React views**: It ensures hot-swapping presets and mode changes update instantaneously.
