# `<Typography />` Component Documentation

The `<Typography />` component provides fluid, responsive typography across all screen resolutions using calibrated `clamp()` formulas, semantic variants, and theme color tokens.

## Import

```tsx
import Typography from "@/components/ui/Typography";
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"title" \| "header" \| "subtitle" \| "body" \| "label" \| "caption"` | `"body"` | Semantic typographical purpose |
| `size` | `"xs" \| "sm" \| "normal" \| "md" \| "lg"` | `"normal"` | Proportional size scaling |
| `color` | `"primary" \| "secondary" \| "dominant" \| "accent" \| "error" \| "warning" \| "success"` | `"default"` | Semantic color token |
| `bold` | `boolean` | `false` | Sets bold font weight (`700`) |
| `underline` | `boolean` | `false` | Underline text decoration |
| `crossed` | `boolean` | `false` | Line-through text decoration |
| `italicized` | `boolean` | `false` | Italic font style |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |
| `opacity` | `number` | `1` | Opacity multiplier |

## Font Size Mapping Matrix

| Variant | `xs` | `sm` | `normal` | `md` | `lg` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`title`** | 24px - 32px | 28px - 40px | 32px - 48px | 40px - 56px | 48px - 72px |
| **`header`** | 18px - 24px | 20px - 28px | 24px - 32px | 28px - 36px | 32px - 44px |
| **`subtitle`** | 14px - 16px | 16px - 18px | 18px - 20px | 20px - 24px | 24px - 28px |
| **`body`** | 12px - 14px | 14px - 16px | 16px - 18px | 18px - 20px | 20px - 22px |
| **`caption`** | 10px - 11px | 11px - 12px | 12px - 14px | 14px - 16px | 16px - 18px |
| **`label`** | 10px - 12px | 12px - 14px | 14px - 16px | 16px - 18px | 18px - 20px |

## Examples

```tsx
import Typography from "@/components/ui/Typography";

export function TypographyShowcase() {
  return (
    <div>
      <Typography variant="title" size="lg" bold>
        Grand Oasis Resort
      </Typography>

      <Typography variant="header" size="sm" bold color="primary">
        Hospitality Management Console
      </Typography>

      <Typography variant="body" size="normal" color="secondary">
        Review real-time occupancy statistics and shift assignments.
      </Typography>

      <Typography variant="caption" size="xs" color="secondary" sx={{ textTransform: "uppercase" }}>
        SYSTEM TELEMETRY v2.4
      </Typography>
    </div>
  );
}
```
