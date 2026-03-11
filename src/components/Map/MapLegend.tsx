import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div>
      <div style={{ 
        color: '#00ffff', 
        fontSize: 15, 
        fontWeight: 700, 
        marginBottom: 14,
        letterSpacing: '0.5px',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
      }}>
        📍 图例说明
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Well status */}
        <div style={{ fontSize: 12, color: '#b8c9dd' }}>
          <div style={{ 
            marginBottom: 8, 
            fontWeight: 700, 
            color: '#00d9ff',
            fontSize: 12
          }}>
            井筒状态
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#52c41a',
              border: '2px solid #fff',
              boxShadow: '0 0 8px rgba(82, 196, 26, 0.6)'
            }} />
            <span>正常运行</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#faad14',
              border: '2px solid #fff',
              boxShadow: '0 0 8px rgba(250, 173, 20, 0.6)'
            }} />
            <span>预警状态</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#ff4d4f',
              border: '2px solid #fff',
              boxShadow: '0 0 8px rgba(255, 77, 79, 0.6)'
            }} />
            <span>故障异常</span>
          </div>
        </div>

        {/* Terrain */}
        <div style={{ fontSize: 12, color: '#b8c9dd', marginTop: 4 }}>
          <div style={{ 
            marginBottom: 8, 
            fontWeight: 700, 
            color: '#00d9ff',
            fontSize: 12
          }}>
            地形标识
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 24,
              height: 10,
              background: 'rgba(255, 193, 7, 0.4)',
              border: '1.5px solid rgba(255, 193, 7, 0.8)',
              borderRadius: 3,
              boxShadow: '0 0 8px rgba(255, 193, 7, 0.4)'
            }} />
            <span>开采区域</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <svg width="24" height="10" style={{ overflow: 'visible' }}>
              <line x1="0" y1="5" x2="24" y2="5" stroke="#ff6b6b" strokeWidth="2.5" />
              <polygon points="21,2 24,5 21,8" fill="#ff6b6b" />
            </svg>
            <span>边界断层</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="10">
              <path
                d="M 0,5 Q 4,3 8,5 T 16,5 T 24,5"
                fill="none"
                stroke="rgba(255, 193, 7, 0.8)"
                strokeWidth="1.5"
              />
            </svg>
            <span>等高线</span>
          </div>
        </div>

        {/* Areas */}
        <div style={{ fontSize: 12, color: '#b8c9dd', marginTop: 4 }}>
          <div style={{ 
            marginBottom: 8, 
            fontWeight: 700, 
            color: '#00d9ff',
            fontSize: 12
          }}>
            区域划分
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(100, 150, 255, 0.15)', 
              border: '1px solid rgba(0, 200, 255, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              A区 北部
            </div>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(100, 200, 150, 0.15)', 
              border: '1px solid rgba(0, 255, 200, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              B区 中北
            </div>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(255, 200, 100, 0.15)', 
              border: '1px solid rgba(255, 200, 100, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              C区 中南
            </div>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(150, 100, 255, 0.15)', 
              border: '1px solid rgba(200, 150, 255, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              D区 东部
            </div>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(255, 150, 150, 0.15)', 
              border: '1px solid rgba(255, 100, 100, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              E区 东南
            </div>
            <div style={{ 
              padding: '3px 8px', 
              background: 'rgba(100, 255, 200, 0.15)', 
              border: '1px solid rgba(100, 255, 180, 0.4)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              F区 西南
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
