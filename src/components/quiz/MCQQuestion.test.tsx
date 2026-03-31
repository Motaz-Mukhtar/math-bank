import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MCQQuestion } from './MCQQuestion';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';

describe('MCQQuestion', () => {
  const mockQuestion = {
    id: '1',
    text: 'ما هو ٢ + ٢؟',
    questionType: QuestionType.MCQ,
    category: QuizCategory.ADDITION,
    level: QuizLevel.EASY,
    points: 5,
    options: ['٢', '٣', '٤', '٥'],
    answer: '٤',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders question text', () => {
    const onSubmit = vi.fn();
    render(<MCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
  });

  it('renders all 4 options', () => {
    const onSubmit = vi.fn();
    render(<MCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('٢')).toBeInTheDocument();
    expect(screen.getByText('٣')).toBeInTheDocument();
    expect(screen.getByText('٤')).toBeInTheDocument();
    expect(screen.getByText('٥')).toBeInTheDocument();
  });

  it('calls onSubmit with selected option when clicked', () => {
    const onSubmit = vi.fn();
    render(<MCQQuestion question={mockQuestion} onSubmit={onSubmit} />);
    
    const option = screen.getByText('٤');
    fireEvent.click(option);
    
    expect(onSubmit).toHaveBeenCalledWith('٤');
  });
});
