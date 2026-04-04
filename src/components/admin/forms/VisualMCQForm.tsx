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
  { params: { shape: 'circle', color: '#3b82f6' }, label: 'A' },
  { params: { shape: 'square', color: '#ef4444' }, label: 'B' },
  { params: { shape: 'triangle', color: '#10b981' }, label: 'C' },
  { params: { shape: 'rectangle', color: '#f59e0b' }, label: 'D' },
];

// Default params for each SVG type
const DEFAULT_PARAMS_BY_TYPE: Record<SVGType, Record<string, unknown>> = {
  [SVGType.FRACTION_CIRCLE]: { numerator: 1, denominator: 4 },
  [SVGType.FRACTION_RECT]: { numerator: 2, denominator: 4 },
  [SVGType.FRACTION_GROUP]: { total: 6, shaded: 3, shape: 'circle' },
  [SVGType.SHAPE_2D]: { shape: 'circle', color: '#3b82f6' },
  [SVGType.SHAPE_3D]: { shape: 'cube', color: '#3b82f6' },
  [SVGType.DOT_ARRAY]: { rows: 3, cols: 4 },
  [SVGType.SYMMETRY]: { type: 'vertical' },
  [SVGType.GRID_AREA]: { rows: 4, cols: 4, shadedCells: [0, 1, 4, 5] },
  [SVGType.BAR_CHART]: { values: [3, 5, 2, 7], labels: ['A', 'B', 'C', 'D'] },
  [SVGType.CLOCK_FACE]: { hours: 3, minutes: 15 },
};

export function VisualMCQForm({ value, onChange }: VisualMCQFormProps) {
  const [svgType, setSvgType] = useState<SVGType>(
    value?.svgType || SVGType.SHAPE_2D
  );
  const [choices, setChoices] = useState<VisualMCQChoice[]>(
    value?.choices || DEFAULT_CHOICES
  );
  const [answer, setAnswer] = useState<'0' | '1' | '2' | '3'>(
    value?.answer || '0'
  );

  // Update choices with default params when SVG type changes
  const handleSvgTypeChange = (newType: SVGType) => {
    setSvgType(newType);
    
    // Update all choices with default params for the new type
    const defaultParams = DEFAULT_PARAMS_BY_TYPE[newType] || {};
    const newChoices = choices.map((choice, index) => ({
      ...choice,
      params: Object.keys(choice.params).length === 0 ? defaultParams : choice.params,
    }));
    setChoices(newChoices);
  };
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
          نوع الرسم
        </Label>
        <Select
          value={svgType}
          onValueChange={handleSvgTypeChange}
        >
          <SelectTrigger id="svg-type" className="w-full">
            <SelectValue placeholder="اختر نوع الرسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SVGType.FRACTION_CIRCLE}>كسر دائرة</SelectItem>
            <SelectItem value={SVGType.FRACTION_RECT}>كسر مستطيل</SelectItem>
            <SelectItem value={SVGType.FRACTION_GROUP}>مجموعة كسور</SelectItem>
            <SelectItem value={SVGType.SHAPE_2D}>شكل ثنائي الأبعاد</SelectItem>
            <SelectItem value={SVGType.SHAPE_3D}>شكل ثلاثي الأبعاد</SelectItem>
            <SelectItem value={SVGType.DOT_ARRAY}>مصفوفة نقاط</SelectItem>
            <SelectItem value={SVGType.SYMMETRY}>تناظر</SelectItem>
            <SelectItem value={SVGType.GRID_AREA}>مساحة الشبكة</SelectItem>
            <SelectItem value={SVGType.BAR_CHART}>مخطط شريطي</SelectItem>
            <SelectItem value={SVGType.CLOCK_FACE}>وجه ساعة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">الخيارات</Label>
        {choices.map((choice, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                الخيار {index} ({choice.label})
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
                التسمية
              </Label>
              <Input
                id={`label-${index}`}
                value={choice.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                placeholder="أدخل التسمية"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`params-${index}`} className="text-sm">
                المعلمات (JSON)
              </Label>
              <Input
                id={`params-${index}`}
                value={JSON.stringify(choice.params)}
                onChange={(e) => handleParamsChange(index, e.target.value)}
                placeholder={JSON.stringify(DEFAULT_PARAMS_BY_TYPE[svgType] || {})}
                className="w-full font-mono text-sm"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                مثال: {JSON.stringify(DEFAULT_PARAMS_BY_TYPE[svgType] || {})}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="correct-answer" className="text-base font-semibold">
          الإجابة الصحيحة
        </Label>
        <Select
          value={answer}
          onValueChange={(value) => setAnswer(value as '0' | '1' | '2' | '3')}
        >
          <SelectTrigger id="correct-answer" className="w-full">
            <SelectValue placeholder="اختر الإجابة الصحيحة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">الخيار 0 ({choices[0].label})</SelectItem>
            <SelectItem value="1">الخيار 1 ({choices[1].label})</SelectItem>
            <SelectItem value="2">الخيار 2 ({choices[2].label})</SelectItem>
            <SelectItem value="3">الخيار 3 ({choices[3].label})</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
