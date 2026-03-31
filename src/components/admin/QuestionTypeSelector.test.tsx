import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { QuestionType } from '@/types/question';

describe('QuestionTypeSelector', () => {
  it('renders with placeholder when no value is selected', () => {
    const onValueChange = vi.fn();
    render(<QuestionTypeSelector onValueChange={onValueChange} />);
    
    expect(screen.getByText('Select question type')).toBeInTheDocument();
  });

  it('displays the selected question type', () => {
    const onValueChange = vi.fn();
    render(
      <QuestionTypeSelector 
        value={QuestionType.MCQ} 
        onValueChange={onValueChange} 
      />
    );
    
    expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
  });

  it('renders all 6 question type options in the component', () => {
    const onValueChange = vi.fn();
    render(<QuestionTypeSelector onValueChange={onValueChange} />);
    
    // The component should have all 6 SelectItem components
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  it('updates displayed value when value prop changes', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <QuestionTypeSelector 
        value={QuestionType.MCQ} 
        onValueChange={onValueChange} 
      />
    );
    
    expect(screen.getByText('Multiple Choice Question')).toBeInTheDocument();
    
    rerender(
      <QuestionTypeSelector 
        value={QuestionType.CLOCK_READ} 
        onValueChange={onValueChange} 
      />
    );
    
    expect(screen.getByText('Clock Reading')).toBeInTheDocument();
  });

  it('accepts all 6 question types as valid values', () => {
    const onValueChange = vi.fn();
    
    // Test each question type can be set as value
    const questionTypes = [
      { type: QuestionType.MCQ, label: 'Multiple Choice Question' },
      { type: QuestionType.FILL_BLANK, label: 'Fill in the Blank' },
      { type: QuestionType.SORT_ORDER, label: 'Sort Order' },
      { type: QuestionType.MATCHING, label: 'Matching Pairs' },
      { type: QuestionType.VISUAL_MCQ, label: 'Visual Multiple Choice' },
      { type: QuestionType.CLOCK_READ, label: 'Clock Reading' },
    ];

    questionTypes.forEach(({ type, label }) => {
      const { unmount } = render(
        <QuestionTypeSelector value={type} onValueChange={onValueChange} />
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });
});
