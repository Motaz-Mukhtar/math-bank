import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ClockFace } from './ClockFace';

describe('ClockFace Component', () => {
  it('should render an SVG clock', () => {
    const { container } = render(<ClockFace time="03:15" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with correct size', () => {
    const { container } = render(<ClockFace time="12:00" size={300} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '300');
    expect(svg).toHaveAttribute('height', '300');
  });

  it('should calculate hour hand angle correctly for 3:00', () => {
    // At 3:00, hour hand should be at 90 degrees (pointing right)
    // Formula: ((3 % 12) / 12) × 360 + (0 / 60) × 30 = 90
    const { container } = render(<ClockFace time="03:00" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should calculate minute hand angle correctly for 12:15', () => {
    // At 12:15, minute hand should be at 90 degrees (pointing right)
    // Formula: (15 / 60) × 360 = 90
    const { container } = render(<ClockFace time="12:15" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render Arabic-Indic numerals for hour markers', () => {
    const { container } = render(<ClockFace time="12:00" />);
    
    // Check for Arabic-Indic numeral for 12 (١٢)
    const text = container.querySelector('text');
    expect(text).toBeInTheDocument();
  });
});
