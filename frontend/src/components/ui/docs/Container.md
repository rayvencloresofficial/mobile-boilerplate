# `<Container />` Component Documentation

The `<Container />` component is the standard surface wrapper for all cards, panels, modules, and content boxes across the application. **Always use `<Container />` instead of Joy UI `<Card />`.**

## Import

```tsx
import Container from "@/components/ui/Container";
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `elevation` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Box-shadow depth level (0 = flat, 6 = high float) |
| `variant` | `"filled" \| "outlined"` | `"filled"` | Surface variant |
| `radius` | `string` | `"0.5rem"` | Border radius (e.g. `"12px"`, `"16px"`) |
| `padding` | `string` | `clamp(...)` | Fluid padding |
| `gap` | `string` | `clamp(...)` | Gap between flex children |
| `direction` | `"row" \| "column"` | `"column"` | Flexbox direction |
| `hover` | `boolean` | `false` | Enables interactive hover micro-animations |
| `hoverEffect` | `"lift" \| "glow" \| "scale" \| "highlight" \| "shadow-expand"` | `"lift"` | Hover effect style |
| `animation` | `"fade-in" \| "slide-up" \| "slide-down" \| "zoom-in" \| ...` | `undefined` | Entrance animation |
| `disabled` | `boolean` | `false` | Sets disabled cursor and prevents click events |
| `style` | `CSSProperties` | `undefined` | Native style overrides |
| `sx` | `CSSProperties` | `undefined` | Joy UI sx property overrides |

## Examples

### 1. Elevated Operational Card
```tsx
import Container from "@/components/ui/Container";
import Typography from "@/components/ui/Typography";
import { useThemeColors } from "@/hooks/useThemeColors";

export function RoomStatusCard() {
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
        Room 402 &bull; Presidential Suite
      </Typography>
      <Typography variant="body" size="xs" color="secondary">
        Status: Cleaned &bull; Ready for Check-in
      </Typography>
    </Container>
  );
}
```

### 2. Interactive Clickable Panel
```tsx
<Container
  elevation={1}
  radius="12px"
  hover
  hoverEffect="scale"
  cursor="pointer"
  onClick={() => navigate("/admin/rooms/calendar")}
>
  View Calendar
</Container>
```
