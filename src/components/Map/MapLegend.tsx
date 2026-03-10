import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div>
      <div style={{ color: '#00ffff', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
        图例
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Well status */}
        <div style={{ fontSize: 11, color: '#8c9eb5' }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>井筒状态</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#52c41a',
              border: '1px solid #fff'
            }} />
            <span>正常运行</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#faad14',
              border: '1px solid #fff'
            }} />
            <span>预警状态</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ff4d4f',
              border: '1px solid #fff'
            }} />
            <span>故障异常</span>
          </div>
        </div>

        {/* Terrain */}
        <div style={{ fontSize: 11, color: '#8c9eb5', marginTop: 8 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>地形标识</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 20,
              height: 8,
              background: 'rgba(255, 193, 7, 0.3)',
              border: '1px solid rgba(255, 193, 7, 0.6)',
              borderRadius: 2
            }} />
            <span>开采区域</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#ff4d4f" strokeWidth="2" />
              <polygon points="18,2 20,4 18,6" fill="#ff4d4f" />
            </svg>
            <span>边界断层</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
