import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import StatisticsPanel from '../components/Dashboard/StatisticsPanel';
import StatusCard from '../components/Dashboard/StatusCard';
import WellboreDiagram from '../components/WellDiagram/WellboreDiagram';
import type { Well, Statistics } from '../types';
import { getWells, getStatistics } from '../services/api';

const Home: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWells(), getStatistics()]).then(([w, s]) => {
      setWells(w);
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* 页面标题 */}
      <div style={{
        background: 'linear-gradient(135deg, #002244, #003366)',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(24,144,255,0.1)',
        }} />
        <h1 style={{ color: '#00ffff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          💧 井下积液工况诊断系统
        </h1>
        <p style={{ color: '#8c9eb5', fontSize: 14, margin: 0 }}>
          基于井管电流监测与水敏电阻网的智能积液诊断系统 | 实时监控 · 智能诊断 · 预警管理
        </p>
      </div>

      {/* 统计面板 */}
      <div className="panel-card">
        <div className="panel-title">系统概览</div>
        {stats && <StatisticsPanel stats={stats} />}
      </div>

      {/* 井筒状态卡片 */}
      <div className="panel-card">
        <div className="panel-title">井筒状态总览</div>
        <Row gutter={[12, 12]}>
          {wells.map(well => (
            <Col key={well.id} xs={24} sm={12} md={8} lg={6}>
              <StatusCard well={well} />
            </Col>
          ))}
        </Row>
      </div>

      {/* 井筒示意图 */}
      <div className="panel-card">
        <div className="panel-title">积液高度可视化</div>
        <Row gutter={[8, 8]}>
          {wells.map(well => (
            <Col key={well.id} xs={12} sm={8} md={6} lg={4}>
              <div style={{
                background: '#001529',
                border: '1px solid #1d3a5c',
                borderRadius: 8,
              }}>
                <WellboreDiagram well={well} />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 运行说明 */}
      <div className="panel-card">
        <div className="panel-title">诊断方法说明</div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{
              background: '#001529',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
              padding: 16,
            }}>
              <div style={{ color: '#faad14', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                ⚡ 电流诊断法
              </div>
              <ul style={{ color: '#8c9eb5', fontSize: 13, paddingLeft: 20, lineHeight: 2 }}>
                <li>电流突降超过 <span style={{ color: '#ff4d4f' }}>30%</span> → 疑似积液</li>
                <li>电流波动幅度超过 <span style={{ color: '#faad14' }}>20%</span> → 含气预警</li>
                <li>电流持续低于额定值 <span style={{ color: '#ff4d4f' }}>50%</span> → 严重积液</li>
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{
              background: '#001529',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
              padding: 16,
            }}>
              <div style={{ color: '#1890ff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                💧 水敏电阻网诊断法
              </div>
              <ul style={{ color: '#8c9eb5', fontSize: 13, paddingLeft: 20, lineHeight: 2 }}>
                <li>电阻值低于 <span style={{ color: '#1890ff' }}>1000Ω</span> → 该深度有液</li>
                <li>连续多个传感器检测到积液 → 确定积液高度范围</li>
                <li>综合两种方法进行置信度加权诊断</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
