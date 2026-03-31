import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MCQForm } from './MCQForm';

describe('MCQForm', () => {
  it('renders 4 option inputs', () => {
    const onChange = vi.fn();
    render(<MCQForm onChange={onChange} />);

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 4')).toBeInTheDocument();
  });

  it('renders correct answer dropdown', () => {
    const onChange = vi.fn();
    render(<MCQForm onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: /correct answer/i })).toBeInTheDocument();
  });

  it('calls onChange when initialized', () => {
    const onChange = vi.fn();
    render(<MCQForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.options).toEqual(['', '', '', '']);
    expect(lastCall.answer).toBe('');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      options: ['A', 'B', 'C', 'D'],
      answer: 'B',
    };

    render(<MCQForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText('Option 1')).toHaveValue('A');
    expect(screen.getByLabelText('Option 2')).toHaveValue('B');
    expect(screen.getByLabelText('Option 3')).toHaveValue('C');
    expect(screen.getByLabelText('Option 4')).toHaveValue('D');
  });

  it('disables dropdown when no options are entered', () => {
    const onChange = vi.fn();
    render(<MCQForm onChange={onChange} />);

    const dropdown = screen.getByRole('combobox', { name: /correct answer/i });
    expect(dropdown).toBeDisabled();
  });

  it('validates that answer must be in options array', () => {
    const onChange = vi.fn();
    const initialValue = {
      options: ['A', 'B', 'C', 'D'],
      answer: 'B',
    };

    render(<MCQForm value={initialValue} onChange={onChange} />);

    // Verify onChange was called with valid answer
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.answer).toBe('B');
    expect(lastCall.options).toContain('B');
  });

  it('displays help text when no options are entered', () => {
    const onChange = vi.fn();
    render(<MCQForm onChange={onChange} />);

    expect(screen.getByText('Enter at least one option to select an answer')).toBeInTheDocument();
  });
});
