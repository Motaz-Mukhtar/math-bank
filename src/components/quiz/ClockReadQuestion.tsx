import React from 'react';
import { Button } from '@/components/ui/button';
import { ClockFace } from './ClockFace';
import { ClockReadQuestion as ClockReadQuestionType } from '@/types/question';

interface ClockReadQuestionProps {
  question: ClockReadQuestionType;
  onSubmit: (userAnswer: string) => void;
}

export const ClockReadQuestion: React.FC<ClockReadQuestionProps> = ({ question, onSubmit }) => {
  const handleChoiceClick = (choice: string) => {
    onSubmit(choice);
  };

  const renderAnalogToDigital = () => (
    <div className="flex flex-col gap-6">
      {/* Analog Clock Display */}
      <div className="flex justify-center">
        <ClockFace time={question.options.clockTime} size={250} />
      </div>

      {/* Digital Time Options - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            variant="outline"
            className="h-16 text-xl font-bold hover:bg-primary hover:text-primary-foreground"
          >
            {choice}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderDigitalToAnalog = () => (
    <div className="flex flex-col gap-6">
      {/* Digital Time Display */}
      <div className="text-4xl font-bold text-center p-6 bg-gray-100 rounded-lg">
        {question.options.clockTime}
      </div>

      {/* Analog Clock Options - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-6">
        {question.options.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            variant="outline"
            className="h-auto p-4 hover:bg-primary/10"
          >
            <ClockFace time={choice} size={150} />
          </Button>
        ))}
      </div>
    </div>
  );

  const renderElapsedTime = () => (
    <div className="flex flex-col gap-6">
      {/* Text Options - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.choices.map((choice, index) => (
          <Button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            variant="outline"
            className="h-20 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
          >
            {choice}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="text-xl font-semibold text-center">{question.text}</div>

      {/* Conditional Rendering Based on Display Mode */}
      {question.options.displayMode === 'analog_to_digital' && renderAnalogToDigital()}
      {question.options.displayMode === 'digital_to_analog' && renderDigitalToAnalog()}
      {question.options.displayMode === 'elapsed_time' && renderElapsedTime()}
    </div>
  );
};
