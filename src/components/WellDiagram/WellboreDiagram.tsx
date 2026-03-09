import React from 'react';
import type { Well } from '../../types';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

interface Props {
  well: Well;
  maxDepth?: number;
}

/**
 * 井筒示意图 - 显示积液高度
 */
const WellboreDiagram: React.FC<Props> = ({ well, maxDepth = 2000 }) => {
  const liquidPct = Math.min((well.liquidHeight / maxDepth) * 100, 100);
  const statusColor = STATUS_COLORS[well.status];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 8px',
    }}>
      {/* 井名 */}
      <div style={{ color: '#00ffff', fontSize: 12, marginBottom: 8, fontWeight: 600, textAlign: 'center' }}>
        {well.name}
      </div>

      {/* 井筒图示 */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 4 }}>
        {/* 深度标尺 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: 4,
        }}>
          {[0, 500, 1000, 1500, 2000].map(d => (
            <span key={d} style={{ color: '#8c9eb5', fontSize: 10, textAlign: 'right' }}>{d}m</span>
          ))}
        </div>

        {/* 井筒 */}
        <div style={{
          width: 48,
          height: 160,
          border: '2px solid #1d3a5c',
          borderRadius: 4,
          background: '#001529',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* 积液区域（从底部向上填充） */}
          {liquidPct > 0 && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${liquidPct}%`,
              background: well.status === 'fault'
                ? 'linear-gradient(180deg, #ff4d4f44, #ff4d4f88)'
                : 'linear-gradient(180deg, #1890ff44, #1890ff88)',
              borderTop: `2px solid ${well.status === 'fault' ? '#ff4d4f' : '#1890ff'}`,
              transition: 'height 0.5s ease',
            }} />
          )}

          {/* 泵位置标记 */}
          <div style={{
            position: 'absolute',
            bottom: `${liquidPct}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 6,
            background: '#faad14',
            borderRadius: 2,
          }} />

          {/* 传感器点 */}
          {[20, 40, 60, 80].map(pct => (
            <div key={pct} style={{
              position: 'absolute',
              top: `${pct}%`,
              right: 2,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: (100 - pct) <= liquidPct ? '#1890ff' : '#52c41a',
            }} />
          ))}
        </div>
      </div>

      {/* 状态和积液信息 */}
      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 10,
          background: `${statusColor}22`,
          border: `1px solid ${statusColor}66`,
          color: statusColor,
          fontSize: 11,
          marginBottom: 4,
        }}>
          {STATUS_LABELS[well.status]}
        </div>
        <div style={{ color: '#8c9eb5', fontSize: 11 }}>
          积液高度: <span style={{ color: well.liquidHeight > 0 ? '#ff4d4f' : '#52c41a' }}>
            {well.liquidHeight}m
          </span>
        </div>
      </div>
    </div>
  );
};

export default WellboreDiagram;
