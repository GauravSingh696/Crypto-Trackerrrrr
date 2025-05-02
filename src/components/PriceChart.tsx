import React from 'react';

interface PriceChartProps {
  prices: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  prices,
  width = 200,
  height = 60,
  color = 'currentColor'
}) => {
  if (!prices.length) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className="price-chart">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points} L ${width},${height} L 0,${height} Z`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}; 