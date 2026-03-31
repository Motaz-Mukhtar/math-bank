import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SortOrderQuestion as SortOrderQuestionType } from '@/types/question';

interface SortOrderQuestionProps {
  question: SortOrderQuestionType;
  onSubmit: (userAnswer: string) => void;
}

export const SortOrderQuestion: React.FC<SortOrderQuestionProps> = ({ question, onSubmit }) => {
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]);

  useEffect(() => {
    // Randomize items on mount
    const shuffled = [...question.options.items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled);
    setSlots(Array(question.options.slots).fill(null));
  }, [question]);

  const handleItemClick = (item: string) => {
    // Find first empty slot
    const emptySlotIndex = slots.findIndex((slot) => slot === null);
    if (emptySlotIndex !== -1) {
      const newSlots = [...slots];
      newSlots[emptySlotIndex] = item;
      setSlots(newSlots);
      setAvailableItems(availableItems.filter((i) => i !== item));
    }
  };

  const handleSlotClick = (index: number) => {
    const item = slots[index];
    if (item) {
      const newSlots = [...slots];
      newSlots[index] = null;
      setSlots(newSlots);
      setAvailableItems([...availableItems, item]);
    }
  };

  const handleSubmit = () => {
    const answer = slots.filter((item) => item !== null).join(',');
    onSubmit(answer);
  };

  const isComplete = slots.every((slot) => slot !== null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Instruction */}
      <div className="text-lg text-center text-gray-600">{question.options.instruction}</div>

      {/* Available Items */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-700">العناصر المتاحة:</div>
        <div className="flex flex-wrap gap-2">
          {availableItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleItemClick(item)}
              variant="outline"
              className="h-12 px-4 text-base"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Drop Slots */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-700">الترتيب:</div>
        <div className="flex flex-col gap-2">
          {slots.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSlotClick(index)}
              className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg min-h-[60px] cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                {index + 1}
              </div>
              <div className="flex-1 text-base font-medium">
                {item || <span className="text-gray-400">اضغط لإزالة العنصر</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full max-w-xs mx-auto h-12 text-lg"
        disabled={!isComplete}
      >
        إرسال
      </Button>
    </div>
  );
};
