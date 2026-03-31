import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FillBlankForm } from './FillBlankForm';

describe('FillBlankForm', () => {
  it('renders before text input', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(screen.getByLabelText(/before text/i)).toBeInTheDocument();
  });

  it('renders after text input with optional label', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(screen.getByLabelText(/after text/i)).toBeInTheDocument();
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });

  it('renders pad type dropdown', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: /input type/i })).toBeInTheDocument();
  });

  it('renders answer input', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(screen.getByLabelText(/^answer$/i)).toBeInTheDocument();
  });

  it('calls onChange when initialized with default values', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.before).toBe('');
    expect(lastCall.after).toBeUndefined();
    expect(lastCall.pad).toBe('numeric');
    expect(lastCall.answer).toBe('');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      before: '2 + 2 = ',
      after: ' apples',
      pad: 'fraction' as const,
      answer: '4',
    };

    render(<FillBlankForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText(/before text/i)).toHaveValue('2 + 2 = ');
    expect(screen.getByLabelText(/after text/i)).toHaveValue(' apples');
    expect(screen.getByLabelText(/^answer$/i)).toHaveValue('4');
  });

  it('sets after to undefined when empty', () => {
    const onChange = vi.fn();
    render(<FillBlankForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.after).toBeUndefined();
  });

  it('includes after when non-empty', () => {
    const onChange = vi.fn();
    const initialValue = {
      before: 'Test',
      after: ' units',
      pad: 'numeric' as const,
      answer: '5',
    };

    render(<FillBlankForm value={initialValue} onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.after).toBe(' units');
  });
});
