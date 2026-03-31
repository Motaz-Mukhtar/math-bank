import React from 'react';
import { Question, QuestionType } from '@/types/question';
import { MCQQuestion } from './MCQQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { SortOrderQuestion } from './SortOrderQuestion';
import { MatchingQuestion } from './MatchingQuestion';
import { VisualMCQQuestion } from './VisualMCQQuestion';
import { ClockReadQuestion } from './ClockReadQuestion';

interface QuestionRendererProps {
  question: Question;
  onSubmit: (userAnswer: string) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onSubmit }) => {
  switch (question.questionType) {
    case QuestionType.MCQ:
      return <MCQQuestion question={question} onSubmit={onSubmit} />;
    
    case QuestionType.FILL_BLANK:
      return <FillBlankQuestion question={question} onSubmit={onSubmit} />;
    
    case QuestionType.SORT_ORDER:
      return <SortOrderQuestion question={question} onSubmit={onSubmit} />;
    
    case QuestionType.MATCHING:
      return <MatchingQuestion question={question} onSubmit={onSubmit} />;
    
    case QuestionType.VISUAL_MCQ:
      return <VisualMCQQuestion question={question} onSubmit={onSubmit} />;
    
    case QuestionType.CLOCK_READ:
      return <ClockReadQuestion question={question} onSubmit={onSubmit} />;
    
    default:
      return (
        <div className="text-center text-red-500">
          Unsupported question type
        </div>
      );
  }
};
