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
 * ClockReadForm component for admin panel
 * 
 * Provides a form interface for creating/editing CLOCK_READ questions with:
 * - Time input for clockTime (HH:MM format)
 * - 4 text inputs for choices
 * - Dropdown for displayMode selection
 * - Validation of clockTime format
 * 
 * @example
 * ```tsx
 * <ClockReadForm 
 *   value={{ 
 *     clockTime: '03:30',
 *     choices: ['3:30', '3:00', '4:30', '2:30'],
 *     displayMode: 'analog_to_digital'
 *   }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 7.9, 10.1, 7.2**
 */
export interface ClockReadFormData {
  clockTime: string;
  choices: string[];
  displayMode: 'analog_to_digital' | 'digital_to_analog' | 'elapsed_time';
  answer: string;
}

interface ClockReadFormProps {
  value?: ClockReadFormData;
  onChange: (data: ClockReadFormData) => void;
}

const DEFAULT_CHOICES = ['', '', '', ''];

export function ClockReadForm({ value, onChange }: ClockReadFormProps) {
  const [clockTime, setClockTime] = useState<string>(value?.clockTime || '');
  const [choices, setChoices] = useState<string[]>(
    value?.choices || DEFAULT_CHOICES
  );
  const [displayMode, setDisplayMode] = useState<
    'analog_to_digital' | 'digital_to_analog' | 'elapsed_time'
  >(value?.displayMode || 'analog_to_digital');
  const [answer, setAnswer] = useState<string>(value?.answer || '');
  const [timeError, setTimeError] = useState<string>('');

  // Validate HH:MM format
  const validateClockTime = (time: string): boolean => {
    if (!time) {
      setTimeError('');
      return false;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      setTimeError('Invalid format. Use HH:MM (e.g., 03:30 or 15:45)');
      return false;
    }

    setTimeError('');
    return true;
  };

  // Emit changes to parent
  useEffect(() => {
    const isValid = validateClockTime(clockTime);
    
    onChange({
      clockTime: isValid ? clockTime : '',
      choices,
      displayMode,
      answer,
    });
  }, [clockTime, choices, displayMode, answer, onChange]);

  const handleClockTimeChange = (value: string) => {
    setClockTime(value);
    validateClockTime(value);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);

    // If the changed choice was the selected answer and it's now empty, clear answer
    if (choices[index] === answer && value.trim() === '') {
      setAnswer('');
    }
  };

  // Get valid choices for the answer dropdown (non-empty choices)
  const validChoices = choices.filter(choice => choice.trim() !== '');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clock-time" className="text-base font-semibold">
          Clock Time
        </Label>
        <Input
          id="clock-time"
          value={clockTime}
          onChange={(e) => handleClockTimeChange(e.target.value)}
          placeholder="HH:MM (e.g., 03:30)"
          className="w-full"
        />
        {timeError && (
          <p className="text-sm text-red-500">{timeError}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Enter time in HH:MM format (24-hour)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="display-mode" className="text-base font-semibold">
          Display Mode
        </Label>
        <Select
          value={displayMode}
          onValueChange={(value) =>
            setDisplayMode(
              value as 'analog_to_digital' | 'digital_to_analog' | 'elapsed_time'
            )
          }
        >
          <SelectTrigger id="display-mode" className="w-full">
            <SelectValue placeholder="Select display mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analog_to_digital">
              Analog to Digital
            </SelectItem>
            <SelectItem value="digital_to_analog">
              Digital to Analog
            </SelectItem>
            <SelectItem value="elapsed_time">
              Elapsed Time
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose how the clock question will be displayed
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Choices</Label>
        {choices.map((choice, index) => (
          <div key={index} className="space-y-1">
            <Label htmlFor={`choice-${index}`} className="text-sm">
              Choice {index + 1}
            </Label>
            <Input
              id={`choice-${index}`}
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder={`Enter choice ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label htmlFor="correct-answer" className="text-base font-semibold">
          Correct Answer
        </Label>
        <Select
          value={answer}
          onValueChange={setAnswer}
          disabled={validChoices.length === 0}
        >
          <SelectTrigger id="correct-answer" className="w-full">
            <SelectValue placeholder="Select correct answer" />
          </SelectTrigger>
          <SelectContent>
            {validChoices.map((choice, index) => (
              <SelectItem key={index} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validChoices.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Enter at least one choice to select an answer
          </p>
        )}
      </div>
    </div>
  );
}
