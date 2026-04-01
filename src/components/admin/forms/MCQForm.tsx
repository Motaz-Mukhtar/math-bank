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
 * MCQForm component for admin panel
 * 
 * Provides a form interface for creating/editing MCQ questions with:
 * - 4 text inputs for options
 * - Dropdown to select correct answer from options
 * - Validation that answer exists in options array
 * 
 * @example
 * ```tsx
 * <MCQForm 
 *   value={{ options: ['A', 'B', 'C', 'D'], answer: 'A' }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 2.5, 10.1**
 */
export interface MCQFormData {
  options: string[];
  answer: string;
}

interface MCQFormProps {
  value?: MCQFormData;
  onChange: (data: MCQFormData) => void;
}

export function MCQForm({ value, onChange }: MCQFormProps) {
  const [options, setOptions] = useState<string[]>(
    value?.options || ['', '', '', '']
  );
  const [answer, setAnswer] = useState<string>(value?.answer || '');

  // Emit changes to parent
  useEffect(() => {
    // Validate that answer is in options array (non-empty options only)
    const validOptions = options.filter(opt => opt.trim() !== '');
    const isAnswerValid = validOptions.includes(answer);

    onChange({
      options,
      answer: isAnswerValid ? answer : '',
    });
  }, [options, answer, onChange]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // If the changed option was the selected answer and it's now empty, clear answer
    if (options[index] === answer && value.trim() === '') {
      setAnswer('');
    }
  };

  // Get valid options for the answer dropdown (non-empty options)
  const validOptions = options.filter(opt => opt.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-base font-semibold">الخيارات</Label>
        {options.map((option, index) => (
          <div key={index} className="space-y-1">
            <Label htmlFor={`option-${index}`} className="text-sm">
              الخيار {index + 1}
            </Label>
            <Input
              id={`option-${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`أدخل الخيار ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="correct-answer" className="text-base font-semibold">
          الإجابة الصحيحة
        </Label>
        <Select
          value={answer}
          onValueChange={setAnswer}
          disabled={validOptions.length === 0}
        >
          <SelectTrigger id="correct-answer" className="w-full">
            <SelectValue placeholder="اختر الإجابة الصحيحة" />
          </SelectTrigger>
          <SelectContent>
            {validOptions.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validOptions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            أدخل خيارًا واحدًا على الأقل ﻹختيار إجابة
          </p>
        )}
      </div>
    </div>
  );
}
