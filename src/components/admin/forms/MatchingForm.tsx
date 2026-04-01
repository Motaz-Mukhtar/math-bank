import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * MatchingForm component for admin panel
 * 
 * Provides a form interface for creating/editing MATCHING questions with:
 * - Interface to define exactly 4 pairs with left and right values
 * - Validation that exactly 4 pairs are provided
 * - Formats answer as pipe-separated "left:right" pairs
 * 
 * @example
 * ```tsx
 * <MatchingForm 
 *   value={{ 
 *     pairs: [
 *       { left: 'A', right: '1' },
 *       { left: 'B', right: '2' },
 *       { left: 'C', right: '3' },
 *       { left: 'D', right: '4' }
 *     ],
 *     answer: 'A:1|B:2|C:3|D:4'
 *   }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 5.7, 10.1**
 */
export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingFormData {
  pairs: MatchingPair[];
  answer: string;
}

interface MatchingFormProps {
  value?: MatchingFormData;
  onChange: (data: MatchingFormData) => void;
}

export function MatchingForm({ value, onChange }: MatchingFormProps) {
  const [pairs, setPairs] = useState<MatchingPair[]>(
    value?.pairs || [
      { left: '', right: '' },
      { left: '', right: '' },
      { left: '', right: '' },
      { left: '', right: '' },
    ]
  );

  // Emit changes to parent
  useEffect(() => {
    // Validate that all 4 pairs have both left and right values
    const validPairs = pairs.filter(
      pair => pair.left.trim() !== '' && pair.right.trim() !== ''
    );

    // Generate answer as pipe-separated "left:right" pairs
    const answer = validPairs.length === 4
      ? validPairs.map(pair => `${pair.left}:${pair.right}`).join('|')
      : '';

    onChange({
      pairs,
      answer,
    });
  }, [pairs, onChange]);

  const handlePairChange = (index: number, field: 'left' | 'right', value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = {
      ...newPairs[index],
      [field]: value,
    };
    setPairs(newPairs);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          أزواج المطابقة <span className="text-sm font-normal text-muted-foreground">(4 أزواج مطلوبة)</span>
        </Label>

        {pairs.map((pair, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-md bg-muted/30">
            <Label className="text-sm font-medium">زوج {index + 1}</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`pair-${index}-left`} className="text-xs text-muted-foreground">
                  الطرف الأيسر
                </Label>
                <Input
                  id={`pair-${index}-left`}
                  value={pair.left}
                  onChange={(e) => handlePairChange(index, 'left', e.target.value)}
                  placeholder="أدخل الطرف الأيسر"
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`pair-${index}-right`} className="text-xs text-muted-foreground">
                  الطرف الأيمن
                </Label>
                <Input
                  id={`pair-${index}-right`}
                  value={pair.right}
                  onChange={(e) => handlePairChange(index, 'right', e.target.value)}
                  placeholder="أدخل الطرف الأيمن"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>سيقوم الطلاب بمطابقة العناصر اليسرى مع العناصر اليمنى. سيتم خلط كلا العمودين بشكل مستقل أثناء الاختبار.</p>
      </div>
    </div>
  );
}
