import React, { useEffect, useState } from 'react';
import { Row, Col, Select } from 'antd';
import CurrentChart from '../components/Charts/CurrentChart';
import type { Well, MonitorDataPoint } from '../types';
import { getWells, getMonitorData } from '../services/api';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { useSimulation } from '../contexts/SimulationContext';

const CurrentMonitor: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [selectedWellId, setSelectedWellId] = useState<string>('all');
  const [dataMap, setDataMap] = useState<Record<string, MonitorDataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const { isSimulationRunning } = useSimulation();

  // Initial load of wells and data
  useEffect(() => {
    getWells().then(async data => {
      setWells(data);
      // 预加载所有井筒数据
      const map: Record<string, MonitorDataPoint[]> = {};
      await Promise.all(
        data.map(async w => {
          map[w.id] = await getMonitorData(w.id);
        })
      );
      setDataMap(map);
      setLoading(false);
    });
  }, []);

  // Refresh data periodically when simulation is running
  useEffect(() => {
    if (!isSimulationRunning || wells.length === 0) return;

    const refreshInterval = window.setInterval(async () => {
      const map: Record<string, MonitorDataPoint[]> = {};
      await Promise.all(
        wells.map(async w => {
          map[w.id] = await getMonitorData(w.id);
        })
      );
      setDataMap(map);
    }, 3000); // Refresh every 3 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSimulationRunning, wells]);

  const displayWells = selectedWellId === 'all'
    ? wells
    : wells.filter(w => w.id === selectedWellId);

  const getCurrentValue = (wellId: string) => {
    const data = dataMap[wellId];
    if (!data || data.length === 0) return 0;
    return data[data.length - 1].current;
  };

  return (
    <div className="page-container">
      {/* 标题和筛选 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: '12px 16px',
        background: '#002244',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
      }}>
        <div className="panel-title" style={{ margin: 0 }}>井筒电流实况监控</div>
        <Select
          value={selectedWellId}
          onChange={setSelectedWellId}
          style={{ width: 200 }}
          options={[
            { label: '全部井筒', value: 'all' },
            ...wells.map(w => ({ label: w.name, value: w.id })),
          ]}
        />
      </div>

      {/* 电流状态概览 */}
      <div className="panel-card">
        <div className="panel-title">实时电流状态</div>
        <Row gutter={[12, 12]}>
          {wells.map(well => {
            const current = getCurrentValue(well.id);
            const statusColor = STATUS_COLORS[well.status];
            const isAbnormal = well.status !== 'normal';
            return (
              <Col key={well.id} xs={12} sm={8} md={6} lg={4}>
                <div style={{
                  background: '#001529',
                  border: `1px solid ${isAbnormal ? statusColor + '66' : '#1d3a5c'}`,
                  borderRadius: 8,
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onClick={() => setSelectedWellId(well.id)}
                >
                  <div style={{ color: '#00ffff', fontSize: 11, marginBottom: 6, fontWeight: 600 }}>
                    {well.name.split('-').slice(-2).join('-')}
                  </div>
                  <div style={{
                    color: isAbnormal ? statusColor : '#52c41a',
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>
                    {current.toFixed(1)}
                    <span style={{ fontSize: 11, color: '#8c9eb5', marginLeft: 2 }}>A</span>
                  </div>
                  <div style={{
                    marginTop: 6,
                    padding: '2px 6px',
                    borderRadius: 8,
                    background: `${statusColor}22`,
                    color: statusColor,
                    fontSize: 11,
                    display: 'inline-block',
                  }}>
                    {STATUS_LABELS[well.status]}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* 电流曲线 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8c9eb5' }}>加载中...</div>
      ) : (
        <Row gutter={[12, 12]}>
          {displayWells.map(well => (
            <Col key={well.id} xs={24} xl={selectedWellId === 'all' ? 12 : 24}>
              <div className="panel-card" style={{ marginBottom: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <div className="panel-title" style={{ marginBottom: 0 }}>
                    {well.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#8c9eb5', fontSize: 12 }}>
                      当前电流: <span style={{ color: '#ff4d4f', fontWeight: 700 }}>
                        {getCurrentValue(well.id).toFixed(1)} A
                      </span>
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 8,
                      background: `${STATUS_COLORS[well.status]}22`,
                      color: STATUS_COLORS[well.status],
                      fontSize: 12,
                    }}>
                      {STATUS_LABELS[well.status]}
                    </span>
                  </div>
                </div>
                <CurrentChart
                  data={dataMap[well.id] || []}
                  height={selectedWellId === 'all' ? 200 : 280}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CurrentMonitor;
