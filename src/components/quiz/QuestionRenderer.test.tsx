import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestionRenderer } from './QuestionRenderer';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import type {
  MCQQuestion,
  FillBlankQuestion,
  SortOrderQuestion,
  MatchingQuestion,
  VisualMCQQuestion,
  ClockReadQuestion,
} from '@/types/question';

describe('QuestionRenderer', () => {
  const mockOnSubmit = vi.fn();
  const baseQuestion = {
    id: '1',
    text: 'Test question',
    category: QuizCategory.ADDITION,
    level: QuizLevel.EASY,
    points: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders MCQQuestion for MCQ type', () => {
    const question: MCQQuestion = {
      ...baseQuestion,
      questionType: QuestionType.MCQ,
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      answer: 'Option 1',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('renders FillBlankQuestion for FILL_BLANK type', () => {
    const question: FillBlankQuestion = {
      ...baseQuestion,
      questionType: QuestionType.FILL_BLANK,
      options: {
        before: 'The answer is',
        after: 'units',
        pad: 'numeric',
      },
      answer: '42',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('renders SortOrderQuestion for SORT_ORDER type', () => {
    const question: SortOrderQuestion = {
      ...baseQuestion,
      questionType: QuestionType.SORT_ORDER,
      options: {
        items: ['First', 'Second', 'Third'],
        instruction: 'Sort these items',
        slots: 3,
      },
      answer: 'First,Second,Third',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('renders MatchingQuestion for MATCHING type', () => {
    const question: MatchingQuestion = {
      ...baseQuestion,
      questionType: QuestionType.MATCHING,
      options: {
        pairs: [
          { left: 'A', right: '1' },
          { left: 'B', right: '2' },
          { left: 'C', right: '3' },
          { left: 'D', right: '4' },
        ],
      },
      answer: 'A:1|B:2|C:3|D:4',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('renders VisualMCQQuestion for VISUAL_MCQ type', () => {
    const question: VisualMCQQuestion = {
      ...baseQuestion,
      questionType: QuestionType.VISUAL_MCQ,
      options: {
        svgType: 'FRACTION_CIRCLE' as any,
        choices: [
          { params: { numerator: 1, denominator: 2 }, label: '1/2' },
          { params: { numerator: 1, denominator: 3 }, label: '1/3' },
          { params: { numerator: 1, denominator: 4 }, label: '1/4' },
          { params: { numerator: 2, denominator: 3 }, label: '2/3' },
        ],
      },
      answer: '0',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('renders ClockReadQuestion for CLOCK_READ type', () => {
    const question: ClockReadQuestion = {
      ...baseQuestion,
      questionType: QuestionType.CLOCK_READ,
      options: {
        clockTime: '03:30',
        choices: ['03:30', '03:00', '04:30', '04:00'],
        displayMode: 'analog_to_digital',
      },
      answer: '03:30',
    };

    render(<QuestionRenderer question={question} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });
});
