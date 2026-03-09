import React, { useEffect, useState } from 'react';
import { Row, Col, Tag } from 'antd';
import CurrentChart from '../components/Charts/CurrentChart';
import StatusCard from '../components/Dashboard/StatusCard';
import type { Well, MonitorDataPoint } from '../types';
import { getWells, getMonitorData } from '../services/api';
import { STATUS_COLORS, CURRENT_THRESHOLDS } from '../utils/constants';
import { diagnoseByCurrent } from '../utils/diagnosis';

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

  const diagnosis = monitorData.length > 0 ? diagnoseByCurrent(monitorData) : null;
  const latest = monitorData.length > 0 ? monitorData[monitorData.length - 1] : null;
  const sliced = monitorData.slice(-10);
  const avgCurrent = sliced.length > 0
    ? (sliced.reduce((s, d) => s + d.current, 0) / sliced.length).toFixed(2)
    : '--';

  return (
    <div className="page-container">
      <Row gutter={16}>
        {/* 左侧：井管列表 */}
        <Col xs={24} lg={6}>
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <div className="panel-title">井管列表</div>
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
                    {selectedWell.name} — 涡轮机电流监测
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
                <div className="panel-title">涡轮机电流曲线 (A)</div>
                <div style={{ color: '#8c9eb5', fontSize: 12, marginBottom: 8 }}>
                  红线 = 实测电流 | 蓝虚线 = 额定电流 ({CURRENT_THRESHOLDS.ratedCurrent} A)
                </div>
                {loading ? (
                  <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9eb5' }}>
                    加载中...
                  </div>
                ) : (
                  <CurrentChart data={monitorData} height={280} />
                )}
              </div>

              {/* 涡轮机诊断结果 */}
              {!loading && diagnosis && (
                <div className="panel-card">
                  <div className="panel-title">涡轮机工作状态诊断</div>
                  <div style={{
                    background: diagnosis.status === 'fault' ? '#2a0a0a' : diagnosis.status === 'warning' ? '#2a1a00' : '#0a1f0a',
                    border: `1px solid ${diagnosis.status === 'fault' ? '#ff4d4f' : diagnosis.status === 'warning' ? '#faad14' : '#52c41a'}`,
                    borderRadius: 8,
                    padding: '16px',
                    marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>
                        {diagnosis.status === 'fault' ? '🔴' : diagnosis.status === 'warning' ? '🟡' : '🟢'}
                      </span>
                      <span style={{
                        color: diagnosis.status === 'fault' ? '#ff4d4f' : diagnosis.status === 'warning' ? '#faad14' : '#52c41a',
                        fontSize: 15,
                        fontWeight: 600,
                      }}>
                        涡轮机状态：{diagnosis.status === 'fault' ? '异常（故障）' : diagnosis.status === 'warning' ? '运行不稳定（预警）' : '运行正常'}
                      </span>
                    </div>
                    <div style={{ color: '#c8d8e8', fontSize: 13, lineHeight: 1.6 }}>
                      {diagnosis.diagnosis}
                    </div>
                    {diagnosis.liquidHeight > 0 && (
                      <div style={{ color: '#faad14', fontSize: 13, marginTop: 6 }}>
                        ⚠ 电流特征显示估算积液高度约 {diagnosis.liquidHeight.toFixed(1)} mm
                      </div>
                    )}
                  </div>
                  <Row gutter={[12, 12]}>
                    {[
                      { label: '最新电流', value: latest?.current.toFixed(2), unit: 'A', color: '#ff4d4f' },
                      { label: '10点均值', value: avgCurrent, unit: 'A', color: '#1890ff' },
                      { label: '额定电流', value: CURRENT_THRESHOLDS.ratedCurrent, unit: 'A', color: '#00ffff' },
                      { label: '最大电流', value: monitorData.length > 0 ? Math.max(...monitorData.map(d => d.current)).toFixed(2) : '--', unit: 'A', color: '#52c41a' },
                      { label: '最小电流', value: monitorData.length > 0 ? Math.min(...monitorData.map(d => d.current)).toFixed(2) : '--', unit: 'A', color: '#faad14' },
                    ].map(item => (
                      <Col key={item.label} xs={12} sm={8} md={6} lg={5}>
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
