import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * FillBlankForm component for admin panel
 * 
 * Provides a form interface for creating/editing FILL_BLANK questions with:
 * - Input for before text
 * - Input for after text (optional)
 * - Dropdown for pad type (numeric/fraction)
 * - Input for answer value
 * 
 * @example
 * ```tsx
 * <FillBlankForm 
 *   value={{ 
 *     before: '2 + 2 = ', 
 *     after: ' apples',
 *     pad: 'numeric',
 *     answer: '4'
 *   }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 3.6, 10.1**
 */
export interface FillBlankFormData {
  before: string;
  after?: string;
  pad: 'numeric' | 'fraction';
  answer: string;
}

interface FillBlankFormProps {
  value?: FillBlankFormData;
  onChange: (data: FillBlankFormData) => void;
}

export function FillBlankForm({ value, onChange }: FillBlankFormProps) {
  const [before, setBefore] = useState<string>(value?.before || '');
  const [after, setAfter] = useState<string>(value?.after || '');
  const [pad, setPad] = useState<'numeric' | 'fraction'>(value?.pad || 'numeric');
  const [answer, setAnswer] = useState<string>(value?.answer || '');

  // Emit changes to parent
  useEffect(() => {
    onChange({
      before,
      after: after.trim() !== '' ? after : undefined,
      pad,
      answer,
    });
  }, [before, after, pad, answer, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="before-text" className="text-base font-semibold">
          Before Text
        </Label>
        <Input
          id="before-text"
          value={before}
          onChange={(e) => setBefore(e.target.value)}
          placeholder="Enter text before the blank (e.g., '2 + 2 = ')"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="after-text" className="text-base font-semibold">
          After Text <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="after-text"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
          placeholder="Enter text after the blank (e.g., ' apples')"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pad-type" className="text-base font-semibold">
          Input Type
        </Label>
        <Select
          value={pad}
          onValueChange={(value) => setPad(value as 'numeric' | 'fraction')}
        >
          <SelectTrigger id="pad-type" className="w-full">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="numeric">Numeric (0-9)</SelectItem>
            <SelectItem value="fraction">Fraction (numerator/denominator)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer-value" className="text-base font-semibold">
          Answer
        </Label>
        <Input
          id="answer-value"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={pad === 'numeric' ? 'Enter numeric answer (e.g., 4)' : 'Enter fraction answer (e.g., 1/2)'}
          className="w-full"
        />
      </div>
    </div>
  );
}
