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
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle both columns independently
    const shuffledLeft = [...question.options.pairs.map((p) => p.left)].sort(
      () => Math.random() - 0.5
    );
    const shuffledRight = [...question.options.pairs.map((p) => p.right)].sort(
      () => Math.random() - 0.5
    );
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  }, [question]);

  const handleLeftClick = (item: string) => {
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (selectedLeft) {
      // Check if left item already has a match
      const existingMatch = matches.find((m) => m.left === selectedLeft);
      if (existingMatch) {
        // Replace the match
        setMatches(matches.map((m) => (m.left === selectedLeft ? { left: selectedLeft, right: item } : m)));
      } else {
        // Add new match
        setMatches([...matches, { left: selectedLeft, right: item }]);
      }
      setSelectedLeft(null);
    }
  };

  const handleSubmit = () => {
    const answer = matches.map((m) => `${m.left}:${m.right}`).join('|');
    onSubmit(answer);
  };

  const isLeftMatched = (item: string) => matches.some((m) => m.left === item);
  const isRightMatched = (item: string) => matches.some((m) => m.right === item);
  const getRightMatch = (leftItem: string) => matches.find((m) => m.left === leftItem)?.right;

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
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
          {leftItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleLeftClick(item)}
              variant={selectedLeft === item ? 'default' : isLeftMatched(item) ? 'secondary' : 'outline'}
              className="h-16 text-base relative"
            >
              {item}
              {isLeftMatched(item) && (
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full" />
              )}
            </Button>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-700 text-center">العمود الأيسر</div>
          {rightItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleRightClick(item)}
              variant={isRightMatched(item) ? 'secondary' : 'outline'}
              className="h-16 text-base relative"
              disabled={!selectedLeft}
            >
              {item}
              {isRightMatched(item) && (
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
          matches.map((match, index) => (
            <div key={index} className="flex items-center gap-2 text-base">
              <span className="font-medium">{match.left}</span>
              <span className="text-gray-400">←→</span>
              <span className="font-medium">{match.right}</span>
            </div>
          ))
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full max-w-xs mx-auto h-12 text-lg"
        disabled={matches.length !== question.options.pairs.length}
      >
        إرسال
      </Button>
    </div>
  );
};
