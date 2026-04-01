import React from 'react';
import { SVGType } from '@/types/question';

interface SVGRendererProps {
  svgType: SVGType;
  params: Record<string, unknown>;
  size?: number;
}

export const SVGRenderer: React.FC<SVGRendererProps> = ({ svgType, params, size = 500 }) => {
  switch (svgType) {
    case SVGType.FRACTION_CIRCLE:
      return <FractionCircle params={params} size={size} />;
    case SVGType.FRACTION_RECT:
      return <FractionRect params={params} size={size} />;
    case SVGType.FRACTION_GROUP:
      return <FractionGroup params={params} size={size} />;
    case SVGType.SHAPE_2D:
      return <Shape2D params={params} size={size} />;
    case SVGType.SHAPE_3D:
      return <Shape3D params={params} size={size} />;
    case SVGType.DOT_ARRAY:
      return <DotArray params={params} size={size} />;
    case SVGType.SYMMETRY:
      return <Symmetry params={params} size={size} />;
    case SVGType.GRID_AREA:
      return <GridArea params={params} size={size} />;
    case SVGType.BAR_CHART:
      return <BarChart params={params} size={size} />;
    case SVGType.CLOCK_FACE:
      return <ClockFaceSVG params={params} size={size} />;
    default:
      return <div>Unknown SVG type</div>;
  }
};

// ─── Fraction Circle ─────────────────────────────────────────────────────────

interface FractionCircleParams {
  numerator: number;
  denominator: number;
}

const FractionCircle: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { numerator = 1, denominator = 4 } = params as FractionCircleParams;
  const center = size / 2;
  const radius = size * 0.4;

  const slices = [];
  for (let i = 0; i < denominator; i++) {
    const startAngle = (i * 360) / denominator - 90;
    const endAngle = ((i + 1) * 360) / denominator - 90;
    const isShaded = i < numerator;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = 360 / denominator > 180 ? 1 : 0;

    slices.push(
      <path
        key={i}
        d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={isShaded ? '#3b82f6' : '#e5e7eb'}
        stroke="black"
        strokeWidth="2"
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices}
    </svg>
  );
};

// ─── Fraction Rectangle ──────────────────────────────────────────────────────

interface FractionRectParams {
  numerator: number;
  denominator: number;
}

const FractionRect: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { numerator = 1, denominator = 4 } = params as FractionRectParams;
  const padding = size * 0.1;
  const rectWidth = size - 2 * padding;
  const rectHeight = size * 0.6;
  const sectionWidth = rectWidth / denominator;

  const sections = [];
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < numerator;
    sections.push(
      <rect
        key={i}
        x={padding + i * sectionWidth}
        y={padding}
        width={sectionWidth}
        height={rectHeight}
        fill={isShaded ? '#3b82f6' : '#e5e7eb'}
        stroke="black"
        strokeWidth="2"
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {sections}
    </svg>
  );
};

// ─── Fraction Group ──────────────────────────────────────────────────────────

interface FractionGroupParams {
  total: number;
  shaded: number;
  shape?: 'circle' | 'square';
}

const FractionGroup: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { total = 6, shaded = 2, shape = 'circle' } = params as FractionGroupParams;
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  const shapeSize = size / (cols + 1);
  const padding = shapeSize / 2;

  const shapes = [];
  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = padding + col * shapeSize;
    const y = padding + row * shapeSize;
    const isShaded = i < shaded;

    if (shape === 'circle') {
      shapes.push(
        <circle
          key={i}
          cx={x + shapeSize / 2}
          cy={y + shapeSize / 2}
          r={shapeSize * 0.35}
          fill={isShaded ? '#3b82f6' : '#e5e7eb'}
          stroke="black"
          strokeWidth="2"
        />
      );
    } else {
      shapes.push(
        <rect
          key={i}
          x={x}
          y={y}
          width={shapeSize * 0.7}
          height={shapeSize * 0.7}
          fill={isShaded ? '#3b82f6' : '#e5e7eb'}
          stroke="black"
          strokeWidth="2"
        />
      );
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shapes}
    </svg>
  );
};

// ─── Shape 2D ────────────────────────────────────────────────────────────────

interface Shape2DParams {
  shape: 'circle' | 'square' | 'triangle' | 'rectangle';
  color?: string;
}

const Shape2D: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { shape = 'circle', color = '#3b82f6' } = params as Shape2DParams;
  const center = size / 2;
  const shapeSize = size * 0.6;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shape === 'circle' && (
        <circle
          cx={center}
          cy={center}
          r={shapeSize / 2}
          fill={color}
          stroke="black"
          strokeWidth="2"
        />
      )}
      {shape === 'square' && (
        <rect
          x={center - shapeSize / 2}
          y={center - shapeSize / 2}
          width={shapeSize}
          height={shapeSize}
          fill={color}
          stroke="black"
          strokeWidth="2"
        />
      )}
      {shape === 'triangle' && (
        <polygon
          points={`${center},${center - shapeSize / 2} ${center - shapeSize / 2},${center + shapeSize / 2} ${center + shapeSize / 2},${center + shapeSize / 2}`}
          fill={color}
          stroke="black"
          strokeWidth="2"
        />
      )}
      {shape === 'rectangle' && (
        <rect
          x={center - shapeSize / 2}
          y={center - shapeSize / 3}
          width={shapeSize}
          height={(shapeSize * 2) / 3}
          fill={color}
          stroke="black"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

// ─── Shape 3D ────────────────────────────────────────────────────────────────

interface Shape3DParams {
  shape: 'cube' | 'cylinder' | 'sphere' | 'cone';
  color?: string;
}

const Shape3D: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { shape = 'cube', color = '#3b82f6' } = params as Shape3DParams;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shape === 'cube' && (
        <g>
          {/* Front face */}
          <rect
            x={center - 40}
            y={center - 20}
            width={60}
            height={60}
            fill={color}
            stroke="black"
            strokeWidth="2"
          />
          {/* Top face */}
          <polygon
            points={`${center - 40},${center - 20} ${center - 20},${center - 40} ${center + 40},${center - 40} ${center + 20},${center - 20}`}
            fill={color}
            opacity="0.7"
            stroke="black"
            strokeWidth="2"
          />
          {/* Right face */}
          <polygon
            points={`${center + 20},${center - 20} ${center + 40},${center - 40} ${center + 40},${center + 20} ${center + 20},${center + 40}`}
            fill={color}
            opacity="0.5"
            stroke="black"
            strokeWidth="2"
          />
        </g>
      )}
      {shape === 'cylinder' && (
        <g>
          <ellipse
            cx={center}
            cy={center - 30}
            rx={40}
            ry={15}
            fill={color}
            stroke="black"
            strokeWidth="2"
          />
          <rect
            x={center - 40}
            y={center - 30}
            width={80}
            height={60}
            fill={color}
            stroke="none"
          />
          <line
            x1={center - 40}
            y1={center - 30}
            x2={center - 40}
            y2={center + 30}
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={center + 40}
            y1={center - 30}
            x2={center + 40}
            y2={center + 30}
            stroke="black"
            strokeWidth="2"
          />
          <ellipse
            cx={center}
            cy={center + 30}
            rx={40}
            ry={15}
            fill={color}
            stroke="black"
            strokeWidth="2"
          />
        </g>
      )}
      {shape === 'sphere' && (
        <circle
          cx={center}
          cy={center}
          r={50}
          fill={color}
          stroke="black"
          strokeWidth="2"
        />
      )}
      {shape === 'cone' && (
        <g>
          <ellipse
            cx={center}
            cy={center + 40}
            rx={50}
            ry={15}
            fill={color}
            stroke="black"
            strokeWidth="2"
          />
          <polygon
            points={`${center},${center - 50} ${center - 50},${center + 40} ${center + 50},${center + 40}`}
            fill={color}
            opacity="0.8"
            stroke="black"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
};

// ─── Dot Array ───────────────────────────────────────────────────────────────

interface DotArrayParams {
  rows: number;
  cols: number;
}

const DotArray: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { rows = 3, cols = 4 } = params as DotArrayParams;
  const dotRadius = size / (Math.max(rows, cols) * 3);
  const spacingX = size / (cols + 1);
  const spacingY = size / (rows + 1);

  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={spacingX * (col + 1)}
          cy={spacingY * (row + 1)}
          r={dotRadius}
          fill="#3b82f6"
          stroke="black"
          strokeWidth="1"
        />
      );
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {dots}
    </svg>
  );
};

// ─── Symmetry ────────────────────────────────────────────────────────────────

interface SymmetryParams {
  type: 'vertical' | 'horizontal' | 'rotational';
  shape?: string;
}

const Symmetry: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { type = 'vertical' } = params as SymmetryParams;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Symmetry line */}
      {type === 'vertical' && (
        <line
          x1={center}
          y1={0}
          x2={center}
          y2={size}
          stroke="red"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
      {type === 'horizontal' && (
        <line
          x1={0}
          y1={center}
          x2={size}
          y2={center}
          stroke="red"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}

      {/* Example shape */}
      <polygon
        points={`${center - 30},${center - 40} ${center - 10},${center - 40} ${center - 20},${center - 20}`}
        fill="#3b82f6"
        stroke="black"
        strokeWidth="2"
      />
      {type === 'vertical' && (
        <polygon
          points={`${center + 30},${center - 40} ${center + 10},${center - 40} ${center + 20},${center - 20}`}
          fill="#3b82f6"
          stroke="black"
          strokeWidth="2"
        />
      )}
      {type === 'horizontal' && (
        <polygon
          points={`${center - 30},${center + 40} ${center - 10},${center + 40} ${center - 20},${center + 20}`}
          fill="#3b82f6"
          stroke="black"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

// ─── Grid Area ───────────────────────────────────────────────────────────────

interface GridAreaParams {
  rows: number;
  cols: number;
  shadedCells: number[];
}

const GridArea: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { rows = 4, cols = 4, shadedCells = [] } = params as GridAreaParams;
  const cellSize = size / Math.max(rows, cols);

  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellIndex = row * cols + col;
      const isShaded = shadedCells.includes(cellIndex);
      cells.push(
        <rect
          key={cellIndex}
          x={col * cellSize}
          y={row * cellSize}
          width={cellSize}
          height={cellSize}
          fill={isShaded ? '#3b82f6' : 'white'}
          stroke="black"
          strokeWidth="1"
        />
      );
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
    </svg>
  );
};

// ─── Bar Chart ───────────────────────────────────────────────────────────────

interface BarChartParams {
  values: number[];
  labels?: string[];
}

const BarChart: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { values = [3, 5, 2, 7], labels = [] } = params as BarChartParams;
  const maxValue = Math.max(...values);
  const barWidth = size / (values.length * 2);
  const chartHeight = size * 0.8;
  const padding = size * 0.1;

  const bars = values.map((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * barWidth * 2;
    const y = size - padding - barHeight;

    return (
      <g key={index}>
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill="#3b82f6"
          stroke="black"
          strokeWidth="1"
        />
        {labels[index] && (
          <text
            x={x + barWidth / 2}
            y={size - padding / 2}
            textAnchor="middle"
            fontSize={size * 0.06}
          >
            {labels[index]}
          </text>
        )}
      </g>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* X-axis */}
      <line
        x1={padding}
        y1={size - padding}
        x2={size - padding}
        y2={size - padding}
        stroke="black"
        strokeWidth="2"
      />
      {/* Y-axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={size - padding}
        stroke="black"
        strokeWidth="2"
      />
      {bars}
    </svg>
  );
};

// ─── Clock Face SVG ──────────────────────────────────────────────────────────

interface ClockFaceSVGParams {
  hours: number;
  minutes: number;
}

const ClockFaceSVG: React.FC<{ params: Record<string, unknown>; size: number }> = ({
  params,
  size,
}) => {
  const { hours = 3, minutes = 15 } = params as ClockFaceSVGParams;
  const center = size / 2;
  const radius = size * 0.4;

  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360;

  const getHandPosition = (angle: number, length: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + length * Math.cos(radians),
      y: center + length * Math.sin(radians),
    };
  };

  const hourHandPos = getHandPosition(hourAngle, radius * 0.5);
  const minuteHandPos = getHandPosition(minuteAngle, radius * 0.7);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={radius} fill="white" stroke="black" strokeWidth="2" />
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + radius * 0.85 * Math.cos(angle);
        const y1 = center + radius * 0.85 * Math.sin(angle);
        const x2 = center + radius * 0.95 * Math.cos(angle);
        const y2 = center + radius * 0.95 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="2"
          />
        );
      })}
      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={hourHandPos.x}
        y2={hourHandPos.y}
        stroke="black"
        strokeWidth={size * 0.02}
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={center}
        y1={center}
        x2={minuteHandPos.x}
        y2={minuteHandPos.y}
        stroke="black"
        strokeWidth={size * 0.015}
        strokeLinecap="round"
      />
      <circle cx={center} cy={center} r={size * 0.02} fill="black" />
    </svg>
  );
};
