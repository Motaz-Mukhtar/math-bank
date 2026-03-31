import React from 'react';

interface ClockFaceProps {
  time: string; // HH:MM format
  size?: number;
}

const ARABIC_DIGITS = ['١٢', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١'];

export const ClockFace: React.FC<ClockFaceProps> = ({ time, size = 200 }) => {
  const [hours, minutes] = time.split(':').map(Number);

  // Calculate angles
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360;

  const center = size / 2;
  const clockRadius = size * 0.4;
  const hourHandLength = clockRadius * 0.5;
  const minuteHandLength = clockRadius * 0.7;

  // Calculate hand positions
  const getHandPosition = (angle: number, length: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + length * Math.cos(radians),
      y: center + length * Math.sin(radians),
    };
  };

  const hourHandPos = getHandPosition(hourAngle, hourHandLength);
  const minuteHandPos = getHandPosition(minuteAngle, minuteHandLength);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock circle */}
      <circle
        cx={center}
        cy={center}
        r={clockRadius}
        fill="white"
        stroke="black"
        strokeWidth="2"
      />

      {/* Hour markers and numbers */}
      {ARABIC_DIGITS.map((digit, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        const numberRadius = clockRadius * 0.8;
        const x = center + numberRadius * Math.cos(angle);
        const y = center + numberRadius * Math.sin(angle);

        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.08}
            fontWeight="bold"
          >
            {digit}
          </text>
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

      {/* Center dot */}
      <circle cx={center} cy={center} r={size * 0.02} fill="black" />
    </svg>
  );
};
