import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisualMCQForm } from './VisualMCQForm';
import { SVGType } from '@/types/question';

describe('VisualMCQForm', () => {
  it('renders SVG type dropdown', () => {
    const onChange = vi.fn();
    render(<VisualMCQForm onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: /svg type/i })).toBeInTheDocument();
  });

  it('renders 4 choice editors', () => {
    const onChange = vi.fn();
    render(<VisualMCQForm onChange={onChange} />);

    expect(screen.getAllByText(/choice 0/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/choice 1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/choice 2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/choice 3/i).length).toBeGreaterThan(0);
  });

  it('renders correct answer dropdown', () => {
    const onChange = vi.fn();
    render(<VisualMCQForm onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: /correct answer/i })).toBeInTheDocument();
  });

  it('calls onChange when initialized', () => {
    const onChange = vi.fn();
    render(<VisualMCQForm onChange={onChange} />);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.svgType).toBe(SVGType.FRACTION_CIRCLE);
    expect(lastCall.choices).toHaveLength(4);
    expect(lastCall.answer).toBe('0');
  });

  it('accepts initial value prop', () => {
    const onChange = vi.fn();
    const initialValue = {
      svgType: SVGType.SHAPE_2D,
      choices: [
        { params: { shape: 'circle' }, label: 'A' },
        { params: { shape: 'square' }, label: 'B' },
        { params: { shape: 'triangle' }, label: 'C' },
        { params: { shape: 'rectangle' }, label: 'D' },
      ],
      answer: '1' as const,
    };

    render(<VisualMCQForm value={initialValue} onChange={onChange} />);

    expect(screen.getByLabelText('Label', { selector: '#label-0' })).toHaveValue('A');
    expect(screen.getByLabelText('Label', { selector: '#label-1' })).toHaveValue('B');
    expect(screen.getByLabelText('Label', { selector: '#label-2' })).toHaveValue('C');
    expect(screen.getByLabelText('Label', { selector: '#label-3' })).toHaveValue('D');
  });

  it('renders live preview for each choice', () => {
    const onChange = vi.fn();
    const { container } = render(<VisualMCQForm onChange={onChange} />);

    // SVGRenderer components should be rendered (4 previews)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });

  it('displays param inputs as JSON', () => {
    const onChange = vi.fn();
    render(<VisualMCQForm onChange={onChange} />);

    const paramInputs = screen.getAllByPlaceholderText(/numerator/i);
    expect(paramInputs).toHaveLength(4);
  });
});
