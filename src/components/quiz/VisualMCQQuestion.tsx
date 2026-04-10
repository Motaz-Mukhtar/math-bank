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

  // Debug: Log question data
  console.log('VisualMCQQuestion rendering:', question);
  console.log('Question options:', question.options);
  console.log('Choices:', question.options?.choices);

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
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Visual Choices Grid - 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {question.options.choices.map((choice, index) => {
          // Validate choice params
          const hasValidParams = choice.params && Object.keys(choice.params).length > 0;
          
          return (
            <Button
              key={index}
              onClick={() => handleChoiceClick(index)}
              variant="outline"
              className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/10 min-h-[320px]"
            >
              <div className="w-full flex items-center justify-center" style={{ height: '240px' }}>
                {hasValidParams ? (
                  <div style={{ 
                    transform: 'scale(8.5)', 
                    transformOrigin: 'center'
                  }}>
                    <SVGRenderer
                      svgType={question.options.svgType}
                      params={choice.params}
                      size={28}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded">
                    <span className="text-xs text-muted-foreground text-center">
                      لا توجد معلمات
                    </span>
                  </div>
                )}
              </div>
              {/* {choice.label && (
                <span className="text-lg font-bold text-black">{choice.label}</span>
              )} */}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
