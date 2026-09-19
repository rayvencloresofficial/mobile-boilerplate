# Frontend Documentation Hub

Welcome to the frontend documentation for the **Boilerplate** platform.

## Documentation Index

- [**Joy UI & Frontend Architecture Guide**](./JOY_UI_AND_ARCHITECTURE.md): Full architectural breakdown, portal boundaries, Joy UI design system rules, component priority hierarchy, and code examples.
- [**Colors Utility Guide**](./COLORS_GUIDE.md): Theme palettes, triad tokens (dominant, secondary, accent, surface), dark mode rules, and preset switching.
- [**Container Component Reference**](../components/ui/docs/Container.md): Deep-dive into the `<Container />` wrapper (elevations, hover effects, animation tokens).
- [**Typography Component Reference**](../components/ui/docs/Typography.md): Semantic typography, fluid `clamp()` sizing, and color mappings.
- [**Button Component Reference**](../components/ui/docs/Button.md): Theme-aware color schemes, variants, and decorators.
- [**Calendar Component Reference**](../components/ui/docs/Calendar.md): Hospitality date range picker, booking states, and custom events.

---

## Quick Reference: Component Priority Order

```
1. Local UI Wrappers (src/components/ui/ - Container, Typography, Button, Calendar)
   └── Always use Container instead of Card
2. Joy UI (@mui/joy - Input, FormControl, Select, Chip, Modal, Table, Stack, Box)
3. MUI Material (@mui/material - fallback only when Joy UI lacks a component)
```
