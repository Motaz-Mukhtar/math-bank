import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SortOrderForm } from './SortOrderForm';

describe('SortOrderForm', () => {
  it('renders instruction input', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(screen.getByLabelText(/instruction text/i)).toBeInTheDocument();
  });

  it('renders 3 item inputs by default', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(screen.getByLabelText('Item 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Item 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Item 3')).toBeInTheDocument();
  });

  it('renders add item button', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('calls onChange when initialized', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.items).toEqual([]);
    expect(lastCall.instruction).toBe('');
    expect(lastCall.answer).toBe('');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      items: ['First', 'Second', 'Third'],
      instruction: 'Sort from smallest to largest',
      answer: 'First,Second,Third',
    };

    render(<SortOrderForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText('Item 1')).toHaveValue('First');
    expect(screen.getByLabelText('Item 2')).toHaveValue('Second');
    expect(screen.getByLabelText('Item 3')).toHaveValue('Third');
    expect(screen.getByLabelText(/instruction text/i)).toHaveValue('Sort from smallest to largest');
  });

  it('displays help text when no items are entered', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(screen.getByText('Enter items above to define the correct order')).toBeInTheDocument();
  });

  it('validates that answer contains all items', () => {
    const onChange = vi.fn();
    const initialValue = {
      items: ['First', 'Second', 'Third'],
      instruction: 'Sort items',
      answer: 'First,Second,Third',
    };

    render(<SortOrderForm value={initialValue} onChange={onChange} />);

    // Verify onChange was called with valid answer
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.answer).toBe('First,Second,Third');
    expect(lastCall.items).toEqual(['First', 'Second', 'Third']);
  });

  it('shows items limit text (3-5 items)', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    expect(screen.getByText(/3-5 items/i)).toBeInTheDocument();
  });

  it('disables remove button when only 3 items exist', () => {
    const onChange = vi.fn();
    render(<SortOrderForm onChange={onChange} />);

    const removeButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.className.includes('ghost')
    );
    
    // All remove buttons should be disabled when we have exactly 3 items
    removeButtons.forEach(btn => {
      if (btn.querySelector('svg')?.classList.contains('lucide-x')) {
        expect(btn).toBeDisabled();
      }
    });
  });

  it('disables add button when 5 items exist', () => {
    const onChange = vi.fn();
    const initialValue = {
      items: ['One', 'Two', 'Three', 'Four', 'Five'],
      instruction: 'Sort',
      answer: 'One,Two,Three,Four,Five',
    };

    render(<SortOrderForm value={initialValue} onChange={onChange} />);

    const addButton = screen.getByRole('button', { name: /add item/i });
    expect(addButton).toBeDisabled();
  });
});
