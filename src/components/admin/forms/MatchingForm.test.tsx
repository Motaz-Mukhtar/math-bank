import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchingForm } from './MatchingForm';

describe('MatchingForm', () => {
  it('renders 4 pair inputs', () => {
    const onChange = vi.fn();
    render(<MatchingForm onChange={onChange} />);

    expect(screen.getByText('Pair 1')).toBeInTheDocument();
    expect(screen.getByText('Pair 2')).toBeInTheDocument();
    expect(screen.getByText('Pair 3')).toBeInTheDocument();
    expect(screen.getByText('Pair 4')).toBeInTheDocument();
  });

  it('renders left and right inputs for each pair', () => {
    const onChange = vi.fn();
    render(<MatchingForm onChange={onChange} />);

    expect(screen.getByLabelText('Left Item', { selector: '#pair-0-left' })).toBeInTheDocument();
    expect(screen.getByLabelText('Right Item', { selector: '#pair-0-right' })).toBeInTheDocument();
    expect(screen.getByLabelText('Left Item', { selector: '#pair-1-left' })).toBeInTheDocument();
    expect(screen.getByLabelText('Right Item', { selector: '#pair-1-right' })).toBeInTheDocument();
  });

  it('calls onChange when initialized', () => {
    const onChange = vi.fn();
    render(<MatchingForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.pairs).toHaveLength(4);
    expect(lastCall.answer).toBe('');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      pairs: [
        { left: 'A', right: '1' },
        { left: 'B', right: '2' },
        { left: 'C', right: '3' },
        { left: 'D', right: '4' },
      ],
      answer: 'A:1|B:2|C:3|D:4',
    };

    render(<MatchingForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText('Left Item', { selector: '#pair-0-left' })).toHaveValue('A');
    expect(screen.getByLabelText('Right Item', { selector: '#pair-0-right' })).toHaveValue('1');
    expect(screen.getByLabelText('Left Item', { selector: '#pair-1-left' })).toHaveValue('B');
    expect(screen.getByLabelText('Right Item', { selector: '#pair-1-right' })).toHaveValue('2');
  });

  it('formats answer as pipe-separated pairs when all 4 pairs are complete', () => {
    const onChange = vi.fn();
    const initialValue = {
      pairs: [
        { left: 'Cat', right: 'Meow' },
        { left: 'Dog', right: 'Bark' },
        { left: 'Cow', right: 'Moo' },
        { left: 'Duck', right: 'Quack' },
      ],
      answer: '',
    };

    render(<MatchingForm value={initialValue} onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.answer).toBe('Cat:Meow|Dog:Bark|Cow:Moo|Duck:Quack');
  });

  it('returns empty answer when pairs are incomplete', () => {
    const onChange = vi.fn();
    const initialValue = {
      pairs: [
        { left: 'A', right: '1' },
        { left: 'B', right: '' },
        { left: 'C', right: '3' },
        { left: 'D', right: '4' },
      ],
      answer: '',
    };

    render(<MatchingForm value={initialValue} onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.answer).toBe('');
  });

  it('displays help text about shuffling', () => {
    const onChange = vi.fn();
    render(<MatchingForm onChange={onChange} />);

    expect(screen.getByText(/Students will match left items with right items/i)).toBeInTheDocument();
    expect(screen.getByText(/Both columns will be shuffled independently/i)).toBeInTheDocument();
  });

  it('validates that exactly 4 pairs are required', () => {
    const onChange = vi.fn();
    render(<MatchingForm onChange={onChange} />);

    expect(screen.getByText(/exactly 4 pairs required/i)).toBeInTheDocument();
  });
});
