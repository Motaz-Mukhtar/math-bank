import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisualMCQQuestion } from './VisualMCQQuestion';
import { QuestionType, QuizCategory, QuizLevel, SVGType } from '@/types/question';

describe('VisualMCQQuestion', () => {
  const mockQuestion = {
    id: '1',
    text: 'أي شكل يمثل ١/٤؟',
    questionType: QuestionType.VISUAL_MCQ,
    category: QuizCategory.FRACTIONS,
    level: QuizLevel.EASY,
    points: 8,
    options: {
      svgType: SVGType.FRACTION_CIRCLE,
      choices: [
        { params: { numerator: 1, denominator: 4 }, label: 'أ' },
        { params: { numerator: 1, denominator: 2 }, label: 'ب' },
        { params: { numerator: 3, denominator: 4 }, label: 'ج' },
        { params: { numerator: 2, denominator: 4 }, label: 'د' },
      ],
    },
    answer: '0' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders question text', () => {
    const onSubmit = vi.fn();
    render(<VisualMCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('أي شكل يمثل ١/٤؟')).toBeInTheDocument();
  });

  it('renders all 4 choice labels', () => {
    const onSubmit = vi.fn();
    render(<VisualMCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('أ')).toBeInTheDocument();
    expect(screen.getByText('ب')).toBeInTheDocument();
    expect(screen.getByText('ج')).toBeInTheDocument();
    expect(screen.getByText('د')).toBeInTheDocument();
  });

  it('calls onSubmit with index as string when choice is clicked', () => {
    const onSubmit = vi.fn();
    render(<VisualMCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    
    const firstChoice = screen.getByText('أ').closest('button');
    if (firstChoice) {
      fireEvent.click(firstChoice);
      expect(onSubmit).toHaveBeenCalledWith('0');
    }
  });
});
