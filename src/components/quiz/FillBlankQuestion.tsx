import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumPad } from './NumPad';
import { FillBlankQuestion as FillBlankQuestionType } from '@/types/question';

interface FillBlankQuestionProps {
  question: FillBlankQuestionType;
  onSubmit: (userAnswer: string) => void;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({ question, onSubmit }) => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [numericValue, setNumericValue] = useState('');

  const handleNumPadConfirm = (value: string) => {
    setNumericValue(value);
  };

  const handleSubmit = () => {
    if (question.options.pad === 'fraction') {
      const answer = `${numerator}/${denominator}`;
      onSubmit(answer);
    } else {
      onSubmit(numericValue);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Before and After Text with Input */}
      <div className="flex items-center gap-3 text-lg justify-center flex-wrap">
        {question.options.before && (
          <span className="font-medium">{question.options.before}</span>
        )}

        {question.options.pad === 'fraction' ? (
          <div className="flex flex-col items-center gap-1">
            <Input
              type="text"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              className="w-20 h-12 text-center text-lg"
              placeholder="٠"
            />
            <div className="w-20 h-0.5 bg-gray-400" />
            <Input
              type="text"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              className="w-20 h-12 text-center text-lg"
              placeholder="٠"
            />
          </div>
        ) : (
          <div className="min-w-[100px] h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white text-xl font-bold px-4">
            {numericValue || '٠'}
          </div>
        )}

        {question.options.after && (
          <span className="font-medium">{question.options.after}</span>
        )}
      </div>

      {/* Conditional Input Method */}
      {question.options.pad === 'numeric' && (
        <NumPad onConfirm={handleNumPadConfirm} />
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full max-w-xs mx-auto h-12 text-lg"
        disabled={
          question.options.pad === 'fraction'
            ? !numerator || !denominator
            : !numericValue
        }
      >
        إرسال
      </Button>
    </div>
  );
};
