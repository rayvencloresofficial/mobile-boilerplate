# `<Button />` Component Documentation

The `<Button />` component is the primary button wrapper in the design system, extending Joy UI's Button with theme color integration (`colorScheme`), visual variants, and micro-interactions.

## Import

```tsx
import Button from "@/components/ui/Button";
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"solid" \| "outlined" \| "soft" \| "plain"` | `"solid"` | The button's visual elevation and border treatment |
| `colorScheme` | `"primary" \| "secondary" \| "accent" \| "surface" \| "success" \| "warning" \| "error"` | `"primary"` | Color palette token from `getColors()` |
| `startDecorator` | `ReactNode` | `undefined` | Icon or element positioned before the label |
| `endDecorator` | `ReactNode` | `undefined` | Icon or element positioned after the label |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `onClick` | `(event: MouseEvent) => void` | `undefined` | Click callback |
| `sx` | `SxProps` | `undefined` | Joy UI style overrides |

## Examples

### 1. Primary Solid with Icon Decorators
```tsx
import Button from "@/components/ui/Button";
import { Plus, ArrowRight } from "lucide-react";

export function ExampleButtons() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button
        variant="solid"
        colorScheme="primary"
        startDecorator={<Plus size={16} />}
      >
        Create Reservation
      </Button>

      <Button
        variant="outlined"
        colorScheme="secondary"
        endDecorator={<ArrowRight size={16} />}
      >
        View Details
      </Button>
    </div>
  );
}
```

### 2. Danger / Destructive Action
```tsx
<Button variant="soft" colorScheme="error" onClick={handleDelete}>
  Delete Record
</Button>
```
