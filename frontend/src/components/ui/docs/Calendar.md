# `<Calendar />` Component Documentation

The `<Calendar />` component is an interactive hospitality date picker and occupancy calendar supporting single date or date range selection, booking indicators, and price tags.

## Import

```tsx
import Calendar, { type DateRange, type CalendarEvent } from "@/components/ui/Calendar";
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selectionMode` | `"range" \| "single"` | `"range"` | Selection behavior |
| `startDate` | `string \| null` | `null` | Start date string in `YYYY-MM-DD` |
| `endDate` | `string \| null` | `null` | End date string in `YYYY-MM-DD` |
| `onChange` | `(range: { startDate: string \| null; endDate: string \| null; nights: number }) => void` | `undefined` | Callback fired on range selection |
| `onDateClick` | `(date: Date, event?: CalendarEvent) => void` | `undefined` | Callback fired on date cell click |
| `events` | `CalendarEvent[]` | `[]` | Array of date status indicators |
| `legendItems` | `CalendarLegendItem[]` | `[]` | Items rendered in bottom legend |
| `minDate` | `string` | Today | Minimum selectable date |
| `maxDate` | `string` | `undefined` | Maximum selectable date |

## Examples

```tsx
import { useState } from "react";
import Calendar, { type DateRange } from "@/components/ui/Calendar";

export function BookingCalendarExample() {
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
        { label: "Reserved", color: "#3b82f6" },
        { label: "Occupied", color: "#ef4444" },
        { label: "Maintenance", color: "#f59e0b" },
      ]}
    />
  );
}
```
