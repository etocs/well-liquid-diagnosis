import React from 'react';
import type { Well } from '../../types';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

interface Props {
  well: Well;
  onClick?: (well: Well) => void;
  selected?: boolean;
}

const StatusCard: React.FC<Props> = ({ well, onClick, selected }) => {
  const statusColor = STATUS_COLORS[well.status];

  return (
    <div
      onClick={() => onClick?.(well)}
      style={{
        background: selected ? '#004488' : '#002244',
        border: `1px solid ${selected ? statusColor : '#1d3a5c'}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = statusColor;
        (e.currentTarget as HTMLDivElement).style.background = '#004488';
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#1d3a5c';
          (e.currentTarget as HTMLDivElement).style.background = '#002244';
        }
      }}
    >
      {/* 状态指示灯 */}
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: statusColor,
        boxShadow: `0 0 8px ${statusColor}`,
        animation: well.status !== 'normal' ? 'pulse 2s infinite' : 'none',
      }} />

      {/* 井名 */}
      <div style={{ color: '#00ffff', fontSize: 13, fontWeight: 600, marginBottom: 6, paddingRight: 16 }}>
        {well.name}
      </div>

      <div style={{ color: '#8c9eb5', fontSize: 11, marginBottom: 4 }}>
        {well.zone}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div>
          <div style={{ color: '#8c9eb5', fontSize: 11 }}>积液高度</div>
          <div style={{
            color: well.liquidHeight > 0 ? '#ff4d4f' : '#52c41a',
            fontSize: 18,
            fontWeight: 700,
          }}>
            {well.liquidHeight.toFixed(1)}<span style={{ fontSize: 11, marginLeft: 2 }}>mm</span>
          </div>
        </div>
        <div style={{
          padding: '4px 10px',
          borderRadius: 12,
          background: `${statusColor}22`,
          border: `1px solid ${statusColor}44`,
          color: statusColor,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {STATUS_LABELS[well.status]}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default StatusCard;
