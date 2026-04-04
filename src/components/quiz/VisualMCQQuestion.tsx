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

  // Validate question data
  if (!question.options?.choices || question.options.choices.length === 0) {
    console.error('Invalid VisualMCQ question data:', question);
    return (
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        <div className="text-xl font-semibold text-center text-destructive">
          ⚠️ خطأ في تحميل السؤال - البيانات غير صحيحة
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Visual Choices Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-6">
        {question.options.choices.map((choice, index) => {
          // Validate choice params
          const hasValidParams = choice.params && Object.keys(choice.params).length > 0;
          
          return (
            <Button
              key={index}
              onClick={() => handleChoiceClick(index)}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10"
            >
              {hasValidParams ? (
                <SVGRenderer
                  svgType={question.options.svgType}
                  params={choice.params}
                  size={150}
                />
              ) : (
                <div className="w-[150px] h-[150px] flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded">
                  <span className="text-xs text-muted-foreground text-center">
                    لا توجد معلمات
                  </span>
                </div>
              )}
              {choice.label && (
                <span className="text-base font-medium">{choice.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
