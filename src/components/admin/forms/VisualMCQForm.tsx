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
import { SVGRenderer } from '@/components/quiz/svg/SVGRenderer';
import { SVGType } from '@/types/question';

/**
 * VisualMCQForm component for admin panel
 * 
 * Provides a form interface for creating/editing VISUAL_MCQ questions with:
 * - Dropdown for svgType selection (10 options)
 * - Param editors for each of 4 choices
 * - Live preview of each choice using SVGRenderer
 * - Dropdown to select correct choice (0-3)
 * 
 * @example
 * ```tsx
 * <VisualMCQForm 
 *   value={{ 
 *     svgType: SVGType.FRACTION_CIRCLE,
 *     choices: [
 *       { params: { numerator: 1, denominator: 4 }, label: 'A' },
 *       { params: { numerator: 2, denominator: 4 }, label: 'B' },
 *       { params: { numerator: 3, denominator: 4 }, label: 'C' },
 *       { params: { numerator: 4, denominator: 4 }, label: 'D' }
 *     ],
 *     answer: '0'
 *   }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 6.7, 6.8, 10.1**
 */
export interface VisualMCQChoice {
  params: Record<string, unknown>;
  label: string;
}

export interface VisualMCQFormData {
  svgType: SVGType;
  choices: VisualMCQChoice[];
  answer: '0' | '1' | '2' | '3';
}

interface VisualMCQFormProps {
  value?: VisualMCQFormData;
  onChange: (data: VisualMCQFormData) => void;
}

const DEFAULT_CHOICES: VisualMCQChoice[] = [
  { params: {}, label: 'A' },
  { params: {}, label: 'B' },
  { params: {}, label: 'C' },
  { params: {}, label: 'D' },
];

export function VisualMCQForm({ value, onChange }: VisualMCQFormProps) {
  const [svgType, setSvgType] = useState<SVGType>(
    value?.svgType || SVGType.FRACTION_CIRCLE
  );
  const [choices, setChoices] = useState<VisualMCQChoice[]>(
    value?.choices || DEFAULT_CHOICES
  );
  const [answer, setAnswer] = useState<'0' | '1' | '2' | '3'>(
    value?.answer || '0'
  );

  // Emit changes to parent
  useEffect(() => {
    onChange({
      svgType,
      choices,
      answer,
    });
  }, [svgType, choices, answer, onChange]);

  const handleParamsChange = (index: number, paramsJson: string) => {
    try {
      const params = JSON.parse(paramsJson);
      const newChoices = [...choices];
      newChoices[index] = { ...newChoices[index], params };
      setChoices(newChoices);
    } catch (error) {
      // Invalid JSON, don't update
      console.error('Invalid JSON for params:', error);
    }
  };

  const handleLabelChange = (index: number, label: string) => {
    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], label };
    setChoices(newChoices);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="svg-type" className="text-base font-semibold">
          SVG Type
        </Label>
        <Select
          value={svgType}
          onValueChange={(value) => setSvgType(value as SVGType)}
        >
          <SelectTrigger id="svg-type" className="w-full">
            <SelectValue placeholder="Select SVG type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SVGType.FRACTION_CIRCLE}>Fraction Circle</SelectItem>
            <SelectItem value={SVGType.FRACTION_RECT}>Fraction Rectangle</SelectItem>
            <SelectItem value={SVGType.FRACTION_GROUP}>Fraction Group</SelectItem>
            <SelectItem value={SVGType.SHAPE_2D}>Shape 2D</SelectItem>
            <SelectItem value={SVGType.SHAPE_3D}>Shape 3D</SelectItem>
            <SelectItem value={SVGType.DOT_ARRAY}>Dot Array</SelectItem>
            <SelectItem value={SVGType.SYMMETRY}>Symmetry</SelectItem>
            <SelectItem value={SVGType.GRID_AREA}>Grid Area</SelectItem>
            <SelectItem value={SVGType.BAR_CHART}>Bar Chart</SelectItem>
            <SelectItem value={SVGType.CLOCK_FACE}>Clock Face</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Choices</Label>
        {choices.map((choice, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                Choice {index} ({choice.label})
              </Label>
              <div className="border rounded p-2 bg-gray-50">
                <SVGRenderer
                  svgType={svgType}
                  params={choice.params}
                  size={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`label-${index}`} className="text-sm">
                Label
              </Label>
              <Input
                id={`label-${index}`}
                value={choice.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                placeholder="Enter label"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`params-${index}`} className="text-sm">
                Parameters (JSON)
              </Label>
              <Input
                id={`params-${index}`}
                value={JSON.stringify(choice.params)}
                onChange={(e) => handleParamsChange(index, e.target.value)}
                placeholder='{"numerator": 1, "denominator": 4}'
                className="w-full font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="correct-answer" className="text-base font-semibold">
          Correct Answer
        </Label>
        <Select
          value={answer}
          onValueChange={(value) => setAnswer(value as '0' | '1' | '2' | '3')}
        >
          <SelectTrigger id="correct-answer" className="w-full">
            <SelectValue placeholder="Select correct answer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Choice 0 ({choices[0].label})</SelectItem>
            <SelectItem value="1">Choice 1 ({choices[1].label})</SelectItem>
            <SelectItem value="2">Choice 2 ({choices[2].label})</SelectItem>
            <SelectItem value="3">Choice 3 ({choices[3].label})</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
