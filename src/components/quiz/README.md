# Quiz Shared UI Components

This directory contains reusable UI components for the Question Types System.

## Components

### NumPad

An on-screen numeric keypad with Arabic-Indic numerals (٠-٩).

**Props:**
- `onConfirm: (value: string) => void` - Callback when user confirms input

**Features:**
- Displays Arabic-Indic numerals in 3-column grid
- Appends digits on button press
- Delete button removes last character
- Confirm button triggers callback with current value

**Usage:**
```tsx
import { NumPad } from '@/components/quiz';

<NumPad onConfirm={(value) => console.log(value)} />
```

**Requirements:** 11.1, 11.2, 11.3, 11.4, 14.3

---

### ClockFace

SVG analog clock component with Arabic-Indic hour numbers.

**Props:**
- `time: string` - Time in HH:MM format (required)
- `size?: number` - Clock size in pixels (default: 200)

**Features:**
- Renders analog clock with hour and minute hands
- Hour hand angle: `((hours % 12) / 12) × 360 + (minutes / 60) × 30`
- Minute hand angle: `(minutes / 60) × 360`
- Hour markers displayed in Arabic-Indic numerals

**Usage:**
```tsx
import { ClockFace } from '@/components/quiz';

<ClockFace time="03:15" size={250} />
```

**Requirements:** 11.5, 11.6, 7.6, 7.7, 14.4

---

### SVGRenderer

Renders various SVG visualizations based on type and parameters.

**Props:**
- `svgType: SVGType` - Type of SVG to render (required)
- `params: Record<string, unknown>` - Type-specific parameters (required)
- `size?: number` - SVG size in pixels (default: 200)

**Supported SVG Types:**

1. **FRACTION_CIRCLE** - Circle divided into slices
   - `params: { numerator: number, denominator: number }`

2. **FRACTION_RECT** - Rectangle divided into sections
   - `params: { numerator: number, denominator: number }`

3. **FRACTION_GROUP** - Group of shapes with some shaded
   - `params: { total: number, shaded: number, shape?: 'circle' | 'square' }`

4. **SHAPE_2D** - Basic 2D shapes
   - `params: { shape: 'circle' | 'square' | 'triangle' | 'rectangle', color?: string }`

5. **SHAPE_3D** - 3D shape representations
   - `params: { shape: 'cube' | 'cylinder' | 'sphere' | 'cone', color?: string }`

6. **DOT_ARRAY** - Grid of dots
   - `params: { rows: number, cols: number }`

7. **SYMMETRY** - Symmetry visualization
   - `params: { type: 'vertical' | 'horizontal' | 'rotational' }`

8. **GRID_AREA** - Grid with shaded cells
   - `params: { rows: number, cols: number, shadedCells: number[] }`

9. **BAR_CHART** - Simple bar chart
   - `params: { values: number[], labels?: string[] }`

10. **CLOCK_FACE** - Analog clock
    - `params: { hours: number, minutes: number }`

**Usage:**
```tsx
import { SVGRenderer } from '@/components/quiz';
import { SVGType } from '@/types/question';

<SVGRenderer
  svgType={SVGType.FRACTION_CIRCLE}
  params={{ numerator: 3, denominator: 4 }}
  size={200}
/>
```

**Requirements:** 11.7, 11.8, 11.9, 6.5

---

## Testing

All components have corresponding test files:
- `NumPad.test.tsx`
- `ClockFace.test.tsx`
- `svg/SVGRenderer.test.tsx`

Run tests with:
```bash
npm run test
```

## Directory Structure

```
quiz/
├── NumPad.tsx
├── NumPad.test.tsx
├── ClockFace.tsx
├── ClockFace.test.tsx
├── svg/
│   ├── SVGRenderer.tsx
│   └── SVGRenderer.test.tsx
├── index.ts
└── README.md
```
