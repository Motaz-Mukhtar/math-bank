# Question Type Components

This directory contains type-specific React components for rendering different question types in the Math Bank quiz system.

## Components Overview

### 1. MCQQuestion
**File:** `MCQQuestion.tsx`
**Requirements:** 2.3, 2.5

Renders multiple choice questions with 4 options in a 2×2 grid.

**Props:**
- `question: MCQQuestion` - Question data with options array
- `onSubmit: (userAnswer: string) => void` - Callback when option is selected

**Features:**
- Displays 4 tappable buttons in 2×2 grid layout
- Calls onSubmit immediately when option is clicked
- Uses shadcn/ui Button component

---

### 2. FillBlankQuestion
**File:** `FillBlankQuestion.tsx`
**Requirements:** 3.3, 3.4, 3.5, 3.6

Renders fill-in-the-blank questions with numeric or fraction input.

**Props:**
- `question: FillBlankQuestion` - Question data with before/after text and pad type
- `onSubmit: (userAnswer: string) => void` - Callback when answer is submitted

**Features:**
- Displays before and after text around input area
- Conditionally renders NumPad for `pad: 'numeric'`
- Conditionally renders fraction input (numerator/denominator) for `pad: 'fraction'`
- Submit button enabled only when answer is provided
- For fraction: formats answer as "numerator/denominator"

---

### 3. SortOrderQuestion
**File:** `SortOrderQuestion.tsx`
**Requirements:** 4.4, 4.5, 4.7

Renders drag-and-sort questions where students arrange items in order.

**Props:**
- `question: SortOrderQuestion` - Question data with items, instruction, and slots
- `onSubmit: (userAnswer: string) => void` - Callback when answer is submitted

**Features:**
- Displays instruction text
- Randomizes item order on mount
- Provides numbered drop slots for arranging items
- Click item to place in next empty slot
- Click slot to remove item and return to available items
- Formats answer as comma-separated string (e.g., "item1,item2,item3")
- Submit button enabled only when all slots are filled

---

### 4. MatchingQuestion
**File:** `MatchingQuestion.tsx`
**Requirements:** 5.3, 5.4, 5.5, 5.7

Renders matching questions that connect left and right items.

**Props:**
- `question: MatchingQuestion` - Question data with pairs array
- `onSubmit: (userAnswer: string) => void` - Callback when answer is submitted

**Features:**
- Displays left and right items in separate columns
- Shuffles both columns independently on mount
- Tap left item, then right item to create connection
- Visual indicators (green dots) show matched items
- Displays current matches in a summary section
- Formats answer as pipe-separated "left:right" pairs (e.g., "A:1|B:2|C:3|D:4")
- Submit button enabled only when all pairs are matched

---

### 5. VisualMCQQuestion
**File:** `VisualMCQQuestion.tsx`
**Requirements:** 6.4, 6.5, 6.7

Renders visual multiple choice questions with SVG shapes.

**Props:**
- `question: VisualMCQQuestion` - Question data with svgType and choices
- `onSubmit: (userAnswer: string) => void` - Callback when choice is selected

**Features:**
- Displays 4 SVG shapes in 2×2 grid
- Uses SVGRenderer component to generate shapes from params
- Each choice shows SVG and optional label
- Submits index as string ("0", "1", "2", or "3")
- Calls onSubmit immediately when choice is clicked

---

### 6. ClockReadQuestion
**File:** `ClockReadQuestion.tsx`
**Requirements:** 7.3, 7.4, 7.5, 7.9

Renders clock reading questions with multiple display modes.

**Props:**
- `question: ClockReadQuestion` - Question data with clockTime, choices, and displayMode
- `onSubmit: (userAnswer: string) => void` - Callback when choice is selected

**Features:**
- **analog_to_digital mode:**
  - Shows ClockFace component with analog clock
  - Displays 4 digital time buttons in 2×2 grid
  
- **digital_to_analog mode:**
  - Shows digital time text in large display
  - Displays 4 ClockFace components in 2×2 grid
  
- **elapsed_time mode:**
  - Shows 4 text options in 2×2 grid
  - No clock visualization needed

- Calls onSubmit immediately when choice is clicked

---

## Shared Components Used

### NumPad
Located in `NumPad.tsx`
- On-screen Arabic numeral keyboard (٠-٩)
- Used by FillBlankQuestion for numeric input

### ClockFace
Located in `ClockFace.tsx`
- SVG analog clock with Arabic-Indic numerals
- Used by ClockReadQuestion for time visualization

### SVGRenderer
Located in `svg/SVGRenderer.tsx`
- Generates visual shapes from declarative parameters
- Used by VisualMCQQuestion for shape rendering

---

## Usage Example

```typescript
import { MCQQuestion } from '@/components/quiz';

const question: MCQQuestion = {
  id: '1',
  text: 'ما هو ٢ + ٢؟',
  questionType: QuestionType.MCQ,
  category: QuizCategory.ADDITION,
  level: QuizLevel.EASY,
  points: 5,
  options: ['٢', '٣', '٤', '٥'],
  answer: '٤',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function QuizPage() {
  const handleSubmit = (userAnswer: string) => {
    console.log('User answered:', userAnswer);
    // Submit to backend for validation
  };

  return <MCQQuestion question={question} onSubmit={handleSubmit} />;
}
```

---

## Component Interface Contract

All question components follow this interface:

```typescript
interface QuestionComponentProps<T extends Question> {
  question: T;
  onSubmit: (userAnswer: string) => void;
}
```

**Key Points:**
- All components accept their specific question type
- All components call `onSubmit` with a string answer
- Answer format varies by question type (see individual component docs)
- Components handle their own UI state (selections, input values)
- Parent component handles submission to backend

---

## Answer Format Reference

| Question Type | Answer Format | Example |
|--------------|---------------|---------|
| MCQ | Selected option string | `"٤"` |
| FILL_BLANK | Input value (numeric or fraction) | `"٥"` or `"٣/٤"` |
| SORT_ORDER | Comma-separated items | `"item1,item2,item3"` |
| MATCHING | Pipe-separated pairs | `"A:1\|B:2\|C:3\|D:4"` |
| VISUAL_MCQ | Index as string | `"0"`, `"1"`, `"2"`, or `"3"` |
| CLOCK_READ | Selected choice string | `"٣:١٥"` or `"06:30"` |

---

## Testing

Test files are provided for each component:
- `MCQQuestion.test.tsx`
- `VisualMCQQuestion.test.tsx`
- `ClockReadQuestion.test.tsx`

Run tests with:
```bash
bun test --run
```

---

## Implementation Notes

1. **Arabic Language Support:** All components support Arabic text and numerals
2. **Responsive Design:** Components use Tailwind CSS for responsive layouts
3. **Accessibility:** Uses semantic HTML and shadcn/ui components
4. **Type Safety:** Full TypeScript support with discriminated union types
5. **State Management:** Each component manages its own local state
6. **Validation:** Answer validation happens on backend, not in components
