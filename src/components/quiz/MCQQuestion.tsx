import React from 'react';
import { Button } from '@/components/ui/button';
import { MCQQuestion as MCQQuestionType } from '@/types/question';

interface MCQQuestionProps {
  question: MCQQuestionType;
  onSubmit: (userAnswer: string) => void;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({ question, onSubmit }) => {
  const handleOptionClick = (option: string) => {
    console.log(question, option);
    console.log("hell")
    onSubmit(option);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Options Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleOptionClick(option)}
            variant="outline"
            className="h-20 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
