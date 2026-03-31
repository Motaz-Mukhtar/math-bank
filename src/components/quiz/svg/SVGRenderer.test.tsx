import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SVGRenderer } from './SVGRenderer';
import { SVGType } from '@/types/question';

describe('SVGRenderer Component', () => {
  it('should render FRACTION_CIRCLE', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.FRACTION_CIRCLE}
        params={{ numerator: 1, denominator: 4 }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render FRACTION_RECT', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.FRACTION_RECT}
        params={{ numerator: 2, denominator: 5 }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render FRACTION_GROUP', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.FRACTION_GROUP}
        params={{ total: 6, shaded: 3, shape: 'circle' }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render SHAPE_2D', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.SHAPE_2D}
        params={{ shape: 'circle', color: '#3b82f6' }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render SHAPE_3D', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.SHAPE_3D}
        params={{ shape: 'cube', color: '#3b82f6' }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render DOT_ARRAY with correct number of dots', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.DOT_ARRAY}
        params={{ rows: 3, cols: 4 }}
      />
    );
    
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(12); // 3 rows × 4 cols = 12 dots
  });

  it('should render SYMMETRY', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.SYMMETRY}
        params={{ type: 'vertical' }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render GRID_AREA', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.GRID_AREA}
        params={{ rows: 4, cols: 4, shadedCells: [0, 1, 4, 5] }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render BAR_CHART', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.BAR_CHART}
        params={{ values: [3, 5, 2, 7], labels: ['A', 'B', 'C', 'D'] }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render CLOCK_FACE', () => {
    const { container } = render(
      <SVGRenderer
        svgType={SVGType.CLOCK_FACE}
        params={{ hours: 3, minutes: 15 }}
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
