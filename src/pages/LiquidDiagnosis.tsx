import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Progress, Tag } from 'antd';
import LiquidLevelChart from '../components/Charts/LiquidLevelChart';
import WellboreDiagram from '../components/WellDiagram/WellboreDiagram';
import type { Well, WellResistanceData } from '../types';
import { getWells, getAllResistanceData } from '../services/api';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { comprehensiveDiagnosis } from '../utils/diagnosis';
import { monitorDataMap } from '../mock/data';

const LiquidDiagnosis: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [resistanceDataList, setResistanceDataList] = useState<WellResistanceData[]>([]);
  const [selectedWellId, setSelectedWellId] = useState<string>('W001');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWells(), getAllResistanceData()]).then(([w, r]) => {
      setWells(w);
      setResistanceDataList(r);
      if (w.length > 0) setSelectedWellId(w[0].id);
      setLoading(false);
    });
  }, []);

  const selectedWell = wells.find(w => w.id === selectedWellId);
  const selectedResistance = resistanceDataList.find(r => r.wellId === selectedWellId);

  const diagnosis = selectedWell && selectedResistance
    ? comprehensiveDiagnosis(
        selectedWellId,
        monitorDataMap[selectedWellId] || [],
        selectedResistance.sensors
      )
    : null;

  return (
    <div className="page-container">
      {/* 标题 */}
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
        <div className="panel-title" style={{ margin: 0 }}>水敏电阻网积液高度诊断</div>
        <Select
          value={selectedWellId}
          onChange={setSelectedWellId}
          style={{ width: 220 }}
          options={wells.map(w => ({ label: w.name, value: w.id }))}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#8c9eb5' }}>加载中...</div>
      ) : (
        <Row gutter={16}>
          {/* 左侧：诊断结果 */}
          <Col xs={24} lg={8}>
            {/* 综合诊断结果 */}
            {diagnosis && (
              <div className="panel-card">
                <div className="panel-title">综合诊断结果</div>

                <div style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid #1d3a5c',
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `4px solid ${STATUS_COLORS[diagnosis.status]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    background: `${STATUS_COLORS[diagnosis.status]}22`,
                    boxShadow: `0 0 20px ${STATUS_COLORS[diagnosis.status]}44`,
                  }}>
                    <span style={{ fontSize: 28 }}>
                      {diagnosis.status === 'normal' ? '✅' : diagnosis.status === 'warning' ? '⚠️' : '🚨'}
                    </span>
                  </div>
                  <Tag
                    color={STATUS_COLORS[diagnosis.status]}
                    style={{ fontSize: 16, padding: '4px 16px', fontWeight: 700 }}
                  >
                    {STATUS_LABELS[diagnosis.status]}
                  </Tag>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#8c9eb5', fontSize: 12, marginBottom: 4 }}>积液高度</div>
                  <div style={{
                    color: diagnosis.liquidHeight > 0 ? '#ff4d4f' : '#52c41a',
                    fontSize: 32,
                    fontWeight: 700,
                  }}>
                    {diagnosis.liquidHeight}
                    <span style={{ fontSize: 14, color: '#8c9eb5', marginLeft: 4 }}>m</span>
                  </div>
                  <Progress
                    percent={Math.round((diagnosis.liquidHeight / 2000) * 100)}
                    strokeColor={diagnosis.liquidHeight > 0 ? '#ff4d4f' : '#52c41a'}
                    trailColor="#1d3a5c"
                    showInfo={false}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ color: '#8c9eb5', fontSize: 12, marginBottom: 4 }}>诊断置信度</div>
                  <Progress
                    percent={diagnosis.confidence}
                    strokeColor="#1890ff"
                    trailColor="#1d3a5c"
                    size="small"
                  />
                </div>

                <div style={{
                  background: '#001529',
                  border: '1px solid #1d3a5c',
                  borderRadius: 6,
                  padding: 12,
                  marginBottom: 12,
                }}>
                  <div style={{ color: '#faad14', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>⚡ 电流诊断</div>
                  <div style={{ color: '#c8d8e8', fontSize: 12, lineHeight: 1.6 }}>
                    {diagnosis.currentDiagnosis}
                  </div>
                </div>

                <div style={{
                  background: '#001529',
                  border: '1px solid #1d3a5c',
                  borderRadius: 6,
                  padding: 12,
                }}>
                  <div style={{ color: '#1890ff', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>💧 电阻网诊断</div>
                  <div style={{ color: '#c8d8e8', fontSize: 12, lineHeight: 1.6 }}>
                    {diagnosis.resistanceDiagnosis}
                  </div>
                </div>
              </div>
            )}

            {/* 井筒示意图 */}
            {selectedWell && (
              <div className="panel-card">
                <div className="panel-title">井筒积液示意图</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <WellboreDiagram well={selectedWell} />
                </div>
              </div>
            )}
          </Col>

          {/* 右侧：水敏电阻图表 */}
          <Col xs={24} lg={16}>
            {selectedResistance && (
              <div className="panel-card" style={{ marginBottom: 12 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <div className="panel-title" style={{ marginBottom: 0 }}>
                    水敏电阻传感器数据
                  </div>
                  <div style={{ color: '#8c9eb5', fontSize: 12 }}>
                    更新时间: {selectedResistance.updateTime}
                  </div>
                </div>

                <LiquidLevelChart
                  sensors={selectedResistance.sensors}
                  liquidHeight={selectedResistance.liquidHeight}
                  height={360}
                />
              </div>
            )}

            {/* 传感器详情表格 */}
            {selectedResistance && (
              <div className="panel-card">
                <div className="panel-title">传感器详情</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 13,
                  }}>
                    <thead>
                      <tr style={{ background: '#003366' }}>
                        <th style={{ padding: '8px 12px', color: '#00ffff', textAlign: 'left', border: '1px solid #1d3a5c' }}>传感器编号</th>
                        <th style={{ padding: '8px 12px', color: '#00ffff', textAlign: 'left', border: '1px solid #1d3a5c' }}>深度 (m)</th>
                        <th style={{ padding: '8px 12px', color: '#00ffff', textAlign: 'left', border: '1px solid #1d3a5c' }}>电阻值 (Ω)</th>
                        <th style={{ padding: '8px 12px', color: '#00ffff', textAlign: 'left', border: '1px solid #1d3a5c' }}>积液状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResistance.sensors.map((sensor, idx) => (
                        <tr key={idx} style={{
                          background: sensor.hasLiquid ? '#1890ff11' : '#002244',
                        }}>
                          <td style={{ padding: '8px 12px', color: '#8c9eb5', border: '1px solid #1d3a5c' }}>
                            S{String(idx + 1).padStart(2, '0')}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#c8d8e8', border: '1px solid #1d3a5c' }}>
                            {sensor.depth}
                          </td>
                          <td style={{ padding: '8px 12px', border: '1px solid #1d3a5c' }}>
                            <span style={{
                              color: sensor.resistance < 1000 ? '#1890ff' : '#52c41a',
                              fontWeight: 600,
                            }}>
                              {sensor.resistance}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', border: '1px solid #1d3a5c' }}>
                            {sensor.hasLiquid ? (
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 10,
                                background: '#1890ff22',
                                color: '#1890ff',
                                fontSize: 12,
                              }}>
                                💧 有液
                              </span>
                            ) : (
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 10,
                                background: '#52c41a22',
                                color: '#52c41a',
                                fontSize: 12,
                              }}>
                                ✓ 无液
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default LiquidDiagnosis;
