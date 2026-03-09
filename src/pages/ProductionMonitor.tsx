import React, { useEffect, useState } from 'react';
import { Row, Col, Tag } from 'antd';
import CurrentChart from '../components/Charts/CurrentChart';
import VoltageFreqChart from '../components/Charts/VoltageFreqChart';
import PressureTempChart from '../components/Charts/PressureTempChart';
import StatusCard from '../components/Dashboard/StatusCard';
import type { Well, MonitorDataPoint } from '../types';
import { getWells, getMonitorData } from '../services/api';
import { STATUS_COLORS } from '../utils/constants';

const ProductionMonitor: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [monitorData, setMonitorData] = useState<MonitorDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWells().then(data => {
      setWells(data);
      if (data.length > 0) {
        setSelectedWell(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedWell) {
      setLoading(true);
      getMonitorData(selectedWell.id).then(data => {
        setMonitorData(data);
        setLoading(false);
      });
    }
  }, [selectedWell]);

  return (
    <div className="page-container">
      <Row gutter={16}>
        {/* 左侧：井筒列表 */}
        <Col xs={24} lg={6}>
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <div className="panel-title">井筒列表</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {wells.map(well => (
                <StatusCard
                  key={well.id}
                  well={well}
                  selected={selectedWell?.id === well.id}
                  onClick={setSelectedWell}
                />
              ))}
            </div>
          </div>
        </Col>

        {/* 右侧：监测曲线 */}
        <Col xs={24} lg={18}>
          {selectedWell && (
            <div>
              {/* 标题 */}
              <div style={{
                background: '#002244',
                border: '1px solid #1d3a5c',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ color: '#00ffff', fontSize: 15, fontWeight: 600 }}>
                    {selectedWell.name} 运行监测曲线
                  </span>
                  <span style={{ color: '#8c9eb5', fontSize: 13, marginLeft: 12 }}>
                    {selectedWell.zone}
                  </span>
                </div>
                <Tag color={STATUS_COLORS[selectedWell.status]} style={{ fontSize: 13 }}>
                  {selectedWell.status === 'normal' ? '正常' : selectedWell.status === 'warning' ? '预警' : '故障'}
                </Tag>
              </div>

              {/* 电流图表 */}
              <div className="panel-card">
                <div className="panel-title">电流监测 (A)</div>
                {loading ? (
                  <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9eb5' }}>
                    加载中...
                  </div>
                ) : (
                  <CurrentChart data={monitorData} height={220} />
                )}
              </div>

              {/* 电压频率图表 */}
              <div className="panel-card">
                <div className="panel-title">电压(V) & 电机频率(Hz)</div>
                {!loading && <VoltageFreqChart data={monitorData} height={220} />}
              </div>

              {/* 压力温度图表 */}
              <div className="panel-card">
                <div className="panel-title">吸入口压力(MPa) & 温度(°C)</div>
                {!loading && <PressureTempChart data={monitorData} height={220} />}
              </div>

              {/* 井筒参数摘要 */}
              {monitorData.length > 0 && (
                <div className="panel-card">
                  <div className="panel-title">当前参数摘要</div>
                  <Row gutter={[12, 12]}>
                    {[
                      { label: '电流', value: monitorData[monitorData.length - 1].current, unit: 'A', color: '#ff4d4f' },
                      { label: '电压', value: monitorData[monitorData.length - 1].voltage, unit: 'V', color: '#00ffff' },
                      { label: '电机频率', value: monitorData[monitorData.length - 1].frequency, unit: 'Hz', color: '#52c41a' },
                      { label: '吸入口压力', value: monitorData[monitorData.length - 1].intakePressure, unit: 'MPa', color: '#faad14' },
                      { label: '吸入口温度', value: monitorData[monitorData.length - 1].intakeTemp, unit: '°C', color: '#00ffff' },
                      { label: '绕组温度', value: monitorData[monitorData.length - 1].motorTemp, unit: '°C', color: '#ff7a45' },
                    ].map(item => (
                      <Col key={item.label} xs={12} sm={8} md={4}>
                        <div style={{
                          background: '#001529',
                          border: '1px solid #1d3a5c',
                          borderRadius: 6,
                          padding: '10px',
                          textAlign: 'center',
                        }}>
                          <div style={{ color: '#8c9eb5', fontSize: 11, marginBottom: 4 }}>{item.label}</div>
                          <div style={{ color: item.color, fontSize: 20, fontWeight: 700 }}>
                            {item.value}
                            <span style={{ fontSize: 11, color: '#8c9eb5', marginLeft: 2 }}>{item.unit}</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductionMonitor;
