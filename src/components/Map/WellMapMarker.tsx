import React from 'react';
import type { Well } from '../../types';

interface Props {
  well: Well;
  position: { x: number; y: number };
}

const WellMapMarker: React.FC<Props> = ({ well, position }) => {
  const statusColors = {
    normal: '#52c41a',
    warning: '#faad14',
    fault: '#ff4d4f',
  };

  const color = statusColors[well.status];

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Glow effect */}
      <circle
        r="2.5"
        fill={color}
        opacity="0.3"
        className="pulse-animation"
      />
      {/* Main marker */}
      <circle
        r="1.5"
        fill={color}
        stroke="#fff"
        strokeWidth="0.3"
        style={{ cursor: 'pointer' }}
      />
      {/* Well label */}
      <text
        y="-2.5"
        fontSize="2"
        fill="#fff"
        textAnchor="middle"
        fontWeight="600"
      >
        {well.name.split('-')[1] || well.name}
      </text>
      {/* Status indicator for non-normal wells */}
      {well.status !== 'normal' && (
        <circle
          r="0.5"
          fill="#fff"
          stroke={color}
          strokeWidth="0.2"
          cx="1"
          cy="-1"
        >
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
};

export default WellMapMarker;
