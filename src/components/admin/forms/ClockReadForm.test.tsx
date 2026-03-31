import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClockReadForm } from './ClockReadForm';

describe('ClockReadForm', () => {
  it('renders clock time input', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(screen.getByLabelText('Clock Time')).toBeInTheDocument();
  });

  it('renders display mode dropdown', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: /display mode/i })).toBeInTheDocument();
  });

  it('renders 4 choice inputs', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(screen.getByLabelText('Choice 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice 4')).toBeInTheDocument();
  });

  it('calls onChange when initialized', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.clockTime).toBe('');
    expect(lastCall.choices).toEqual(['', '', '', '']);
    expect(lastCall.displayMode).toBe('analog_to_digital');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      clockTime: '03:30',
      choices: ['3:30', '3:00', '4:30', '2:30'],
      displayMode: 'digital_to_analog' as const,
    };

    render(<ClockReadForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText('Clock Time')).toHaveValue('03:30');
    expect(screen.getByLabelText('Choice 1')).toHaveValue('3:30');
    expect(screen.getByLabelText('Choice 2')).toHaveValue('3:00');
    expect(screen.getByLabelText('Choice 3')).toHaveValue('4:30');
    expect(screen.getByLabelText('Choice 4')).toHaveValue('2:30');
  });

  it('displays help text for time format', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(screen.getByText(/enter time in hh:mm format/i)).toBeInTheDocument();
  });

  it('displays help text for display mode', () => {
    const onChange = vi.fn();
    render(<ClockReadForm onChange={onChange} />);

    expect(screen.getByText(/choose how the clock question will be displayed/i)).toBeInTheDocument();
  });
});
