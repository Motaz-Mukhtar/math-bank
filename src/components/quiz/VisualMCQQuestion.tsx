import React from 'react';
import { Button } from '@/components/ui/button';
import { SVGRenderer } from './svg/SVGRenderer';
import { VisualMCQQuestion as VisualMCQQuestionType } from '@/types/question';

interface VisualMCQQuestionProps {
  question: VisualMCQQuestionType;
  onSubmit: (userAnswer: string) => void;
}

export const VisualMCQQuestion: React.FC<VisualMCQQuestionProps> = ({ question, onSubmit }) => {
  const handleChoiceClick = (index: number) => {
    onSubmit(index.toString());
  };

  console.log(question);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Visual Choices Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-6">
        {question.options.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => handleChoiceClick(index)}
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10"
          >
            <SVGRenderer
              svgType={question.options.svgType}
              params={choice.params}
              size={150}
            />
            {choice.label && (
              <span className="text-base font-medium">{choice.label}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
