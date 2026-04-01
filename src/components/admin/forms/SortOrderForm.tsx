import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus, GripVertical } from 'lucide-react';

/**
 * SortOrderForm component for admin panel
 * 
 * Provides a form interface for creating/editing SORT_ORDER questions with:
 * - Interface to add/remove items (3-5 items)
 * - Input for instruction text
 * - Interface to define correct order
 * - Validation that answer contains all items
 * 
 * @example
 * ```tsx
 * <SortOrderForm 
 *   value={{ 
 *     items: ['First', 'Second', 'Third'],
 *     instruction: 'Sort from smallest to largest',
 *     answer: 'First,Second,Third'
 *   }}
 *   onChange={(data) => console.log(data)}
 * />
 * ```
 * 
 * **Validates: Requirements 4.7, 10.1, 15.6**
 */
export interface SortOrderFormData {
  items: string[];
  instruction: string;
  answer: string;
}

interface SortOrderFormProps {
  value?: SortOrderFormData;
  onChange: (data: SortOrderFormData) => void;
}

export function SortOrderForm({ value, onChange }: SortOrderFormProps) {
  const [items, setItems] = useState<string[]>(
    value?.items || ['', '', '']
  );
  const [instruction, setInstruction] = useState<string>(value?.instruction || '');
  const [correctOrder, setCorrectOrder] = useState<string[]>(() => {
    if (value?.answer) {
      return value.answer.split(',');
    }
    return [];
  });

  // Emit changes to parent
  useEffect(() => {
    // Validate that answer contains all items
    const validItems = items.filter(item => item.trim() !== '');
    const isAnswerValid =
      correctOrder.length === validItems.length &&
      correctOrder.every(item => validItems.includes(item));

    onChange({
      items: validItems,
      instruction,
      answer: isAnswerValid ? correctOrder.join(',') : '',
    });
  }, [items, instruction, correctOrder, onChange]);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    const oldValue = newItems[index];
    newItems[index] = value;
    setItems(newItems);

    // Update correct order if the item was in it
    if (oldValue && correctOrder.includes(oldValue)) {
      const newCorrectOrder = correctOrder.map(item =>
        item === oldValue ? value : item
      );
      setCorrectOrder(newCorrectOrder);
    }
  };

  const handleAddItem = () => {
    if (items.length < 5) {
      setItems([...items, '']);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 3) {
      const removedItem = items[index];
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);

      // Remove from correct order if present
      if (removedItem && correctOrder.includes(removedItem)) {
        setCorrectOrder(correctOrder.filter(item => item !== removedItem));
      }
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...correctOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setCorrectOrder(newOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < correctOrder.length - 1) {
      const newOrder = [...correctOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setCorrectOrder(newOrder);
    }
  };

  const handleAddToOrder = (item: string) => {
    if (!correctOrder.includes(item)) {
      setCorrectOrder([...correctOrder, item]);
    }
  };

  const handleRemoveFromOrder = (item: string) => {
    setCorrectOrder(correctOrder.filter(i => i !== item));
  };

  // Get valid items (non-empty)
  const validItems = items.filter(item => item.trim() !== '');
  const itemsNotInOrder = validItems.filter(item => !correctOrder.includes(item));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="instruction" className="text-base font-semibold">
          نص التعليمات
        </Label>
        <Input
          id="instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="أدخل نص التعليمات (مثال: 'رتب من الأصغر إلى الأكبر')"
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            العناصر <span className="text-sm font-normal text-muted-foreground">(3-5 عناصر)</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            disabled={items.length >= 5}
          >
            <Plus className="h-4 w-4 mr-1" />
            اضافة عنصر
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`item-${index}`} className="text-sm">
                عنصر {index + 1}
              </Label>
              <Input
                id={`item-${index}`}
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`أدخل عنصر ${index + 1}`}
                className="w-full"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(index)}
              disabled={items.length <= 3}
              className="mt-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          الترتيب الصحيح
        </Label>

        {validItems.length === 0 && (
          <p className="text-sm text-muted-foreground">
            أدخل العناصر أعلاه لتحديد الترتيب الصحيح
          </p>
        )}

        {validItems.length > 0 && correctOrder.length === 0 && (
          <p className="text-sm text-muted-foreground">
            انقر على العناصر أدناه لإضافتها إلى الترتيب الصحيح
          </p>
        )}

        {correctOrder.length > 0 && (
          <div className="space-y-2 p-3 border rounded-md bg-muted/30">
            {correctOrder.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-background p-2 rounded border">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{item}</span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === correctOrder.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromOrder(item)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {itemsNotInOrder.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              العناصر المتاحة (انقر للإضافة إلى الترتيب):
            </Label>
            <div className="flex flex-wrap gap-2">
              {itemsNotInOrder.map((item, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToOrder(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
