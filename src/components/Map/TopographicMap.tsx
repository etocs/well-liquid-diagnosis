import React from 'react';
import type { Well } from '../../types';
import WellMapMarker from './WellMapMarker';
import MapLegend from './MapLegend';

interface Props {
  wells: Well[];
}

// Well positions - arranged to create a visual layout
const wellPositions: Record<string, { x: number; y: number }> = {
  'W001': { x: 15, y: 35 },
  'W002': { x: 30, y: 25 },
  'W003': { x: 45, y: 30 },
  'W004': { x: 25, y: 55 },
  'W005': { x: 40, y: 50 },
  'W006': { x: 60, y: 40 },
  'W007': { x: 70, y: 50 },
};

const TopographicMap: React.FC<Props> = ({ wells }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* Map Container */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          background: 'linear-gradient(135deg, #001529 0%, #002a4a 100%)',
          border: '2px solid #1d3a5c',
          borderRadius: 8,
        }}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(24, 144, 255, 0.1)"
              strokeWidth="0.2"
            />
          </pattern>
          
          {/* Contour pattern */}
          <pattern id="contours" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255, 193, 7, 0.15)" strokeWidth="0.3"/>
            <circle cx="10" cy="10" r="6" fill="none" stroke="rgba(255, 193, 7, 0.12)" strokeWidth="0.3"/>
            <circle cx="10" cy="10" r="4" fill="none" stroke="rgba(255, 193, 7, 0.1)" strokeWidth="0.3"/>
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Terrain areas - yellow zones like in the reference */}
        <ellipse
          cx="35"
          cy="40"
          rx="25"
          ry="20"
          fill="rgba(255, 193, 7, 0.2)"
          stroke="rgba(255, 193, 7, 0.4)"
          strokeWidth="0.3"
        />
        <ellipse
          cx="60"
          cy="45"
          rx="20"
          ry="18"
          fill="rgba(255, 193, 7, 0.18)"
          stroke="rgba(255, 193, 7, 0.35)"
          strokeWidth="0.3"
        />

        {/* Contour overlay */}
        <rect width="100" height="100" fill="url(#contours)" opacity="0.6" />

        {/* Boundary lines (red arrows like in reference) */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="4"
            markerHeight="4"
            refX="2"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 4 2, 0 4" fill="#ff4d4f" />
          </marker>
        </defs>
        
        <path
          d="M 10,20 L 30,10 L 60,15 L 85,25"
          stroke="#ff4d4f"
          strokeWidth="0.8"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 15,80 L 40,75 L 70,80 L 90,75"
          stroke="#ff4d4f"
          strokeWidth="0.8"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* North arrow */}
        <g transform="translate(90, 10)">
          <polygon points="0,-3 1,1 0,0.5 -1,1" fill="#00ffff" />
          <text x="0" y="5" fontSize="2" fill="#00ffff" textAnchor="middle">N</text>
        </g>

        {/* Scale bar */}
        <g transform="translate(5, 90)">
          <line x1="0" y1="0" x2="10" y2="0" stroke="#fff" strokeWidth="0.3" />
          <line x1="0" y1="-1" x2="0" y2="1" stroke="#fff" strokeWidth="0.3" />
          <line x1="10" y1="-1" x2="10" y2="1" stroke="#fff" strokeWidth="0.3" />
          <text x="5" y="3" fontSize="2" fill="#fff" textAnchor="middle">5 km</text>
        </g>

        {/* Well markers */}
        {wells.map(well => {
          const pos = wellPositions[well.id] || { x: 50, y: 50 };
          const statusColors = {
            normal: '#52c41a',
            warning: '#faad14',
            fault: '#ff4d4f',
          };
          const color = statusColors[well.status];

          return (
            <g key={well.id} transform={`translate(${pos.x}, ${pos.y})`}>
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
              {/* Status indicator */}
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
        })}
      </svg>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: 'rgba(0, 21, 41, 0.95)',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
        padding: 16,
      }}>
        <MapLegend />
      </div>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.2);
            }
          }
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default TopographicMap;
