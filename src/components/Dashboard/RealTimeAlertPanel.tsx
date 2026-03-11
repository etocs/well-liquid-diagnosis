import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';
import { getAlarmRecords } from '../../services/api';
import type { AlarmRecord } from '../../types';

const RealTimeAlertPanel: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlarms = async () => {
      const result = await getAlarmRecords({ pageNum: 1, pageSize: 100 });
      setAlarms(result.list);
    };
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get latest 5 unprocessed alarms
  const recentAlarms = (alarms || []).filter((a: AlarmRecord) => a.processResult === 'unprocessed').slice(0, 5);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #001529, #002244)',
      border: '1px solid #1d3a5c',
      borderRadius: 8,
      padding: 16,
      height: '100%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <BellOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />
          <span style={{ color: '#00ffff', fontSize: 15, fontWeight: 600 }}>
            实时告警
          </span>
        </div>
        <div
          onClick={() => navigate('/alarm')}
          style={{
            color: '#1890ff',
            fontSize: 12,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          查看全部
        </div>
      </div>

      {recentAlarms.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#8c9eb5',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 14 }}>系统运行正常</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>暂无未处理告警</div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          {recentAlarms.map((alarm: AlarmRecord) => {
            const isLiquidAlarm = alarm.faultType.includes('积液');
            const icon = isLiquidAlarm ? '💧' : '⚡';
            const levelColors: Record<string, string> = {
              level1: '#ff4d4f',
              level2: '#faad14',
              level3: '#1890ff',
            };
            const color = alarm.faultLevel ? levelColors[alarm.faultLevel] : '#faad14';

            return (
              <div
                key={alarm.id}
                style={{
                  background: 'rgba(0, 42, 74, 0.5)',
                  border: `1px solid ${color}33`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 6,
                  padding: '10px 12px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/alarm')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 42, 74, 0.8)';
                  e.currentTarget.style.borderColor = color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 42, 74, 0.5)';
                  e.currentTarget.style.borderColor = `${color}33`;
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <div style={{
                    color: '#00ffff',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {icon} {alarm.wellName}
                  </div>
                  <div style={{
                    color: '#8c9eb5',
                    fontSize: 11,
                  }}>
                    {new Date(alarm.faultTime).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div style={{
                  color: color,
                  fontSize: 12,
                  marginBottom: 4,
                }}>
                  {alarm.faultType}
                </div>
                <div style={{
                  color: '#8c9eb5',
                  fontSize: 11,
                  lineHeight: 1.4,
                }}>
                  {alarm.faultReason}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RealTimeAlertPanel;
