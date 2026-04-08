import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MatchingQuestion as MatchingQuestionType } from '@/types/question';

interface MatchingQuestionProps {
  question: MatchingQuestionType;
  onSubmit: (userAnswer: string) => void;
}

interface Match {
  left: string;
  right: string;
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ question, onSubmit }) => {
  const [leftItems, setLeftItems] = useState<{ value: string; id: number }[]>([]);
  const [rightItems, setRightItems] = useState<{ value: string; id: number }[]>([]);
  const [matches, setMatches] = useState<{ leftId: number; rightId: number }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);

  useEffect(() => {
    // Create items with unique IDs to handle duplicates
    const leftWithIds = question.options.pairs.map((p, idx) => ({ value: p.left, id: idx }));
    const rightWithIds = question.options.pairs.map((p, idx) => ({ value: p.right, id: idx }));
    
    // Shuffle both columns independently
    const shuffledLeft = [...leftWithIds].sort(() => Math.random() - 0.5);
    const shuffledRight = [...rightWithIds].sort(() => Math.random() - 0.5);
    
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  }, [question]);

  const handleLeftClick = (id: number) => {
    setSelectedLeft(id);
  };

  const handleRightClick = (rightId: number) => {
    if (selectedLeft !== null) {
      // Check if left item already has a match
      const existingMatch = matches.find((m) => m.leftId === selectedLeft);
      if (existingMatch) {
        // Replace the match
        setMatches(matches.map((m) => (m.leftId === selectedLeft ? { leftId: selectedLeft, rightId } : m)));
      } else {
        // Add new match
        setMatches([...matches, { leftId: selectedLeft, rightId }]);
      }
      setSelectedLeft(null);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Deselect if clicking on the container itself (not on buttons)
    if (e.target === e.currentTarget) {
      setSelectedLeft(null);
    }
  };

  const isLeftMatched = (id: number) => matches.some((m) => m.leftId === id);
  const isRightMatched = (id: number) => matches.some((m) => m.rightId === id);
  const getLeftItem = (id: number) => leftItems.find((item) => item.id === id);
  const getRightItem = (id: number) => rightItems.find((item) => item.id === id);

  const handleSubmit = () => {
    // Build answer using original pair IDs to maintain correct mapping
    const answer = matches
      .map((m) => {
        const leftItem = getLeftItem(m.leftId);
        const rightItem = getRightItem(m.rightId);
        return `${leftItem?.value}:${rightItem?.value}`;
      })
      .join('|');
    onSubmit(answer);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto" onClick={handleContainerClick}>
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Instruction */}
      <div className="text-base text-center text-gray-600">
        اضغط على عنصر من العمود الأيمن ثم على العنصر المطابق من العمود الأيسر
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-700 text-center">العمود الأيمن</div>
          {leftItems.map((item) => (
            <Button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                handleLeftClick(item.id);
              }}
              variant={selectedLeft === item.id ? 'default' : isLeftMatched(item.id) ? 'secondary' : 'outline'}
              className="h-16 text-base relative"
            >
              {item.value}
              {isLeftMatched(item.id) && (
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full" />
              )}
            </Button>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-700 text-center">العمود الأيسر</div>
          {rightItems.map((item) => (
            <Button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                handleRightClick(item.id);
              }}
              variant={isRightMatched(item.id) ? 'secondary' : 'outline'}
              className="h-16 text-base relative"
              disabled={selectedLeft === null}
            >
              {item.value}
              {isRightMatched(item.id) && (
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Visual Connection Lines */}
      <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-gray-700">المطابقات الحالية:</div>
        {matches.length === 0 ? (
          <div className="text-gray-400 text-center py-2">لم يتم إنشاء مطابقات بعد</div>
        ) : (
          matches.map((match, index) => {
            const leftItem = getLeftItem(match.leftId);
            const rightItem = getRightItem(match.rightId);
            return (
              <div key={index} className="flex items-center gap-2 text-base">
                <span className="font-medium">{leftItem?.value}</span>
                <span className="text-gray-400">←→</span>
                <span className="font-medium">{rightItem?.value}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleSubmit();
        }}
        className="w-full max-w-xs mx-auto h-12 text-lg"
        disabled={matches.length !== question.options.pairs.length}
      >
        إرسال
      </Button>
    </div>
  );
};
