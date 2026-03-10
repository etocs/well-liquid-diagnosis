import React from 'react';
import type { Well } from '../../types';
import WellMapMarker from './WellMapMarker';
import MapLegend from './MapLegend';

interface Props {
  wells: Well[];
}

// Well positions - arranged to create a visual layout across different areas
export const wellPositions: Record<string, { x: number; y: number; area: string }> = {
  'W001': { x: 18, y: 25, area: 'A' },
  'W002': { x: 32, y: 30, area: 'B' },
  'W003': { x: 48, y: 22, area: 'B' },
  'W004': { x: 22, y: 58, area: 'C' },
  'W005': { x: 45, y: 55, area: 'C' },
  'W006': { x: 65, y: 35, area: 'D' },
  'W007': { x: 75, y: 60, area: 'E' },
};

const TopographicMap: React.FC<Props> = ({ wells }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Container */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          background: 'linear-gradient(135deg, #001020 0%, #001a35 50%, #002040 100%)',
          border: '3px solid #1d3a5c',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 100px rgba(0, 100, 200, 0.05)',
        }}
      >
        {/* Advanced patterns and gradients */}
        <defs>
          {/* Fine grid pattern */}
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="rgba(0, 255, 255, 0.08)"
              strokeWidth="0.15"
            />
          </pattern>
          
          {/* Enhanced topographic contour lines */}
          <pattern id="contours" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M 0,4 Q 2,3 4,4 T 8,4"
              fill="none"
              stroke="rgba(255, 193, 7, 0.25)"
              strokeWidth="0.25"
            />
            <path
              d="M 0,6 Q 2,5.5 4,6 T 8,6"
              fill="none"
              stroke="rgba(255, 193, 7, 0.15)"
              strokeWidth="0.2"
            />
            <path
              d="M 0,2 Q 2,1.5 4,2 T 8,2"
              fill="none"
              stroke="rgba(255, 193, 7, 0.12)"
              strokeWidth="0.15"
            />
          </pattern>

          {/* Gradient for mining areas */}
          <radialGradient id="miningGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255, 193, 7, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 193, 7, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 193, 7, 0.05)" />
          </radialGradient>

          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/>
            <feOffset dx="0" dy="0.3" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Glow filter for area boundaries */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        <rect width="100" height="100" fill="url(#grid)" opacity="0.8" />

        {/* Main terrain boundary - full coverage */}
        <path
          d="M 5,10 L 20,5 L 40,8 L 60,6 L 80,12 L 95,15 L 95,85 L 80,92 L 60,88 L 40,90 L 20,86 L 5,82 Z"
          fill="rgba(0, 100, 150, 0.08)"
          stroke="rgba(0, 200, 255, 0.3)"
          strokeWidth="0.4"
          strokeDasharray="2,1"
        />

        {/* Enhanced contour overlay - full terrain display */}
        <rect width="100" height="100" fill="url(#contours)" opacity="0.9" />

        {/* Area A - 北部区域 (North) */}
        <path
          d="M 5,10 L 20,5 L 40,8 L 40,35 L 20,40 L 5,35 Z"
          fill="rgba(100, 150, 255, 0.06)"
          stroke="rgba(0, 200, 255, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="20" y="23" fontSize="5" fill="rgba(0, 255, 255, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          A区
        </text>
        <text x="20" y="28" fontSize="1.8" fill="rgba(0, 200, 255, 0.6)" textAnchor="middle">
          北部开采区
        </text>

        {/* Area B - 中北部区域 (Central-North) */}
        <path
          d="M 40,8 L 60,6 L 60,35 L 40,35 Z"
          fill="rgba(100, 200, 150, 0.06)"
          stroke="rgba(0, 255, 200, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="50" y="22" fontSize="5" fill="rgba(100, 255, 200, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          B区
        </text>
        <text x="50" y="27" fontSize="1.8" fill="rgba(100, 255, 200, 0.6)" textAnchor="middle">
          中北开采区
        </text>

        {/* Mining area highlight in Area B */}
        <ellipse
          cx="48"
          cy="24"
          rx="8"
          ry="10"
          fill="url(#miningGlow)"
          stroke="rgba(255, 193, 7, 0.6)"
          strokeWidth="0.4"
          strokeDasharray="1,0.5"
        />

        {/* Area C - 中南部区域 (Central-South) */}
        <path
          d="M 5,35 L 20,40 L 40,35 L 40,70 L 20,72 L 5,68 Z"
          fill="rgba(255, 200, 100, 0.06)"
          stroke="rgba(255, 200, 100, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="22" y="54" fontSize="5" fill="rgba(255, 220, 100, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          C区
        </text>
        <text x="22" y="59" fontSize="1.8" fill="rgba(255, 200, 100, 0.6)" textAnchor="middle">
          中南开采区
        </text>

        {/* Mining area highlight in Area C */}
        <ellipse
          cx="25"
          cy="56"
          rx="12"
          ry="9"
          fill="url(#miningGlow)"
          stroke="rgba(255, 193, 7, 0.6)"
          strokeWidth="0.4"
          strokeDasharray="1,0.5"
        />

        {/* Area D - 东部区域 (East) */}
        <path
          d="M 60,6 L 80,12 L 95,15 L 95,50 L 80,48 L 60,45 L 60,35 Z"
          fill="rgba(150, 100, 255, 0.06)"
          stroke="rgba(200, 150, 255, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="75" y="32" fontSize="5" fill="rgba(200, 150, 255, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          D区
        </text>
        <text x="75" y="37" fontSize="1.8" fill="rgba(200, 150, 255, 0.6)" textAnchor="middle">
          东部开采区
        </text>

        {/* Area E - 东南部区域 (Southeast) */}
        <path
          d="M 60,45 L 80,48 L 95,50 L 95,85 L 80,92 L 60,88 L 40,90 L 40,70 L 60,70 Z"
          fill="rgba(255, 150, 150, 0.06)"
          stroke="rgba(255, 100, 100, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="70" y="68" fontSize="5" fill="rgba(255, 150, 150, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          E区
        </text>
        <text x="70" y="73" fontSize="1.8" fill="rgba(255, 150, 150, 0.6)" textAnchor="middle">
          东南开采区
        </text>

        {/* Area F - 西南部区域 (Southwest) */}
        <path
          d="M 5,68 L 20,72 L 40,70 L 40,90 L 20,86 L 5,82 Z"
          fill="rgba(100, 255, 200, 0.06)"
          stroke="rgba(100, 255, 180, 0.5)"
          strokeWidth="0.5"
          strokeDasharray="1,0.5"
          filter="url(#glow)"
        />
        <text x="22" y="80" fontSize="5" fill="rgba(100, 255, 200, 0.9)" fontWeight="700" textAnchor="middle" filter="url(#shadow)">
          F区
        </text>
        <text x="22" y="85" fontSize="1.8" fill="rgba(100, 255, 180, 0.6)" textAnchor="middle">
          西南预备区
        </text>

        {/* Boundary indicator lines with arrows */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="4"
            markerHeight="4"
            refX="2"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 4 2, 0 4" fill="#ff6b6b" />
          </marker>
        </defs>
        
        {/* Northern boundary */}
        <path
          d="M 8,8 L 25,6 L 50,7 L 75,10 L 92,14"
          stroke="#ff6b6b"
          strokeWidth="0.6"
          fill="none"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />
        
        {/* Southern boundary */}
        <path
          d="M 8,85 L 30,87 L 50,89 L 70,88 L 92,84"
          stroke="#ff6b6b"
          strokeWidth="0.6"
          fill="none"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />

        {/* North arrow - enhanced */}
        <g transform="translate(92, 8)">
          <circle cx="0" cy="0" r="3" fill="rgba(0, 0, 0, 0.5)" stroke="rgba(0, 255, 255, 0.6)" strokeWidth="0.3" />
          <polygon points="0,-2 0.8,1.2 0,0.8 -0.8,1.2" fill="#00ffff" />
          <text x="0" y="5.5" fontSize="2.2" fill="#00ffff" textAnchor="middle" fontWeight="700">N</text>
        </g>

        {/* Scale bar - enhanced */}
        <g transform="translate(6, 92)">
          <rect x="-1" y="-2" width="17" height="5" fill="rgba(0, 0, 0, 0.5)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.2" rx="0.5" />
          <line x1="0" y1="0" x2="15" y2="0" stroke="#00ffff" strokeWidth="0.4" />
          <line x1="0" y1="-1" x2="0" y2="1" stroke="#00ffff" strokeWidth="0.4" />
          <line x1="5" y1="-0.5" x2="5" y2="0.5" stroke="#00ffff" strokeWidth="0.3" />
          <line x1="10" y1="-0.5" x2="10" y2="0.5" stroke="#00ffff" strokeWidth="0.3" />
          <line x1="15" y1="-1" x2="15" y2="1" stroke="#00ffff" strokeWidth="0.4" />
          <text x="7.5" y="-1.5" fontSize="1.5" fill="#00ffff" textAnchor="middle" fontWeight="600">0 ——— 10km</text>
        </g>

        {/* Well markers with area information */}
        {wells.map(well => {
          const pos = wellPositions[well.id] || { x: 50, y: 50, area: '?' };
          const statusColors = {
            normal: '#52c41a',
            warning: '#faad14',
            fault: '#ff4d4f',
          };
          const color = statusColors[well.status];

          return (
            <g key={well.id} transform={`translate(${pos.x}, ${pos.y})`}>
              {/* Enhanced glow effect */}
              <circle
                r="3"
                fill={color}
                opacity="0.25"
                className="pulse-animation"
              />
              <circle
                r="2"
                fill={color}
                opacity="0.4"
              />
              {/* Main marker with border */}
              <circle
                r="1.2"
                fill={color}
                stroke="#fff"
                strokeWidth="0.4"
                style={{ cursor: 'pointer' }}
                filter="url(#shadow)"
              />
              {/* Inner highlight */}
              <circle
                r="0.5"
                fill="rgba(255, 255, 255, 0.7)"
                cx="-0.3"
                cy="-0.3"
              />
              {/* Well label with background */}
              <rect
                x="-3"
                y="-5"
                width="6"
                height="2.5"
                fill="rgba(0, 0, 0, 0.7)"
                stroke={color}
                strokeWidth="0.2"
                rx="0.3"
              />
              <text
                y="-3.2"
                fontSize="1.8"
                fill="#fff"
                textAnchor="middle"
                fontWeight="700"
              >
                {well.name}
              </text>
              {/* Area label */}
              <text
                y="3.5"
                fontSize="1.5"
                fill="rgba(0, 255, 255, 0.8)"
                textAnchor="middle"
                fontWeight="600"
              >
                {pos.area}区
              </text>
              {/* Liquid height indicator */}
              <text
                y="5.5"
                fontSize="1.2"
                fill={color}
                textAnchor="middle"
              >
                {well.liquidHeight.toFixed(0)}mm
              </text>
              {/* Status indicator for non-normal wells */}
              {well.status !== 'normal' && (
                <g>
                  <circle
                    r="0.6"
                    fill="#fff"
                    stroke={color}
                    strokeWidth="0.25"
                    cx="1.5"
                    cy="-1.5"
                  >
                    <animate
                      attributeName="opacity"
                      values="1;0.3;1"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Warning icon */}
                  <text
                    x="1.5"
                    y="-1"
                    fontSize="1"
                    fill={color}
                    textAnchor="middle"
                    fontWeight="900"
                  >
                    !
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Additional terrain details - elevation markers */}
        <g opacity="0.4">
          <circle cx="28" cy="18" r="0.4" fill="#fadb14" />
          <text x="28" y="16" fontSize="1" fill="#fadb14" textAnchor="middle">▲ 485m</text>
          
          <circle cx="72" cy="28" r="0.4" fill="#fadb14" />
          <text x="72" y="26" fontSize="1" fill="#fadb14" textAnchor="middle">▲ 512m</text>
          
          <circle cx="15" cy="65" r="0.4" fill="#fadb14" />
          <text x="15" y="63" fontSize="1" fill="#fadb14" textAnchor="middle">▲ 445m</text>
          
          <circle cx="82" cy="75" r="0.4" fill="#fadb14" />
          <text x="82" y="73" fontSize="1" fill="#fadb14" textAnchor="middle">▲ 468m</text>
        </g>
      </svg>

      {/* Enhanced Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        background: 'rgba(0, 10, 20, 0.95)',
        border: '2px solid rgba(0, 200, 255, 0.4)',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 200, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <MapLegend />
      </div>

      {/* Area statistics panel */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        background: 'rgba(0, 10, 20, 0.95)',
        border: '2px solid rgba(0, 200, 255, 0.4)',
        borderRadius: 12,
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 200, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        minWidth: 200,
      }}>
        <div style={{ color: '#00ffff', fontSize: 14, fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
          🗺️ 区域统计
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['A', 'B', 'C', 'D', 'E', 'F'].map(area => {
            const areaWells = wells.filter(w => wellPositions[w.id]?.area === area);
            const normalCount = areaWells.filter(w => w.status === 'normal').length;
            const warningCount = areaWells.filter(w => w.status === 'warning').length;
            const faultCount = areaWells.filter(w => w.status === 'fault').length;
            
            if (areaWells.length === 0) return null;
            
            return (
              <div key={area} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#8c9eb5',
                padding: '4px 8px',
                background: 'rgba(0, 100, 150, 0.1)',
                borderRadius: 6,
                border: '1px solid rgba(0, 150, 200, 0.2)',
              }}>
                <span style={{ fontWeight: 600, color: '#00d9ff' }}>{area}区</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {normalCount > 0 && (
                    <span style={{ color: '#52c41a' }}>✓ {normalCount}</span>
                  )}
                  {warningCount > 0 && (
                    <span style={{ color: '#faad14' }}>⚠ {warningCount}</span>
                  )}
                  {faultCount > 0 && (
                    <span style={{ color: '#ff4d4f' }}>✗ {faultCount}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS for enhanced animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.25;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.3);
            }
          }
          .pulse-animation {
            animation: pulse 2.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default TopographicMap;
