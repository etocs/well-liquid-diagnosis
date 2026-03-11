import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import TopographicMap, { wellPositions } from '../components/Map/TopographicMap';
import QuickActionCard from '../components/Dashboard/QuickActionCard';
import RealTimeAlertPanel from '../components/Dashboard/RealTimeAlertPanel';
import AreaFaultTrendChart from '../components/Charts/AreaFaultTrendChart';
import AreaFaultDistributionChart from '../components/Charts/AreaFaultDistributionChart';
import type { Well, Statistics } from '../types';
import { getWells, getStatistics } from '../services/api';
import { useAlarm } from '../contexts/AlarmContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSimulation } from '../contexts/SimulationContext';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const Home: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { checkAlarms } = useAlarm();
  const { themeMode } = useTheme();
  const { isSimulationRunning } = useSimulation();

  // Load initial data
  useEffect(() => {
    Promise.all([getWells(), getStatistics()]).then(([w, s]) => {
      setWells(w);
      setStats(s);
      checkAlarms(w);
      setLoading(false);
    });
  }, [checkAlarms]);

  // Refresh data periodically when simulation is running
  useEffect(() => {
    if (!isSimulationRunning) return;

    const refreshInterval = window.setInterval(async () => {
      const [w, s] = await Promise.all([getWells(), getStatistics()]);
      setWells(w);
      setStats(s);
      checkAlarms(w);
    }, 3000); // Refresh every 3 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSimulationRunning, checkAlarms]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '12px 16px', minHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
      {/* Compact Header with Key Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col span={24}>
          <div style={{
            background: 'linear-gradient(135deg, #001529, #003366)',
            border: '1px solid #1d3a5c',
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{ 
                color: '#00ffff', 
                fontSize: 20, 
                fontWeight: 700, 
                margin: 0,
                textShadow: '0 2px 8px rgba(0, 255, 255, 0.3)',
              }}>
                💧 井下积液工况智能监控平台
              </h1>
            </div>
            
            {/* Inline Key Metrics */}
            {stats && (
              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <DashboardOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div style={{ color: '#1890ff', fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {stats.totalWells}
                    <span style={{ fontSize: 11, marginLeft: 4, color: '#8c9eb5' }}>井筒</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <div style={{ color: '#52c41a', fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {stats.normalWells}
                    <span style={{ fontSize: 11, marginLeft: 4, color: '#8c9eb5' }}>正常</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <ThunderboltOutlined style={{ fontSize: 20, color: '#faad14' }} />
                  <div style={{ color: '#faad14', fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {stats.warningWells + stats.faultWells}
                    <span style={{ fontSize: 11, marginLeft: 4, color: '#8c9eb5' }}>异常</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <ExperimentOutlined style={{ fontSize: 20, color: '#00ffff' }} />
                  <div style={{ color: '#00ffff', fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                    {stats.avgLiquidHeight.toFixed(0)}
                    <span style={{ fontSize: 11, marginLeft: 4, color: '#8c9eb5' }}>mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Main Content Row - 200px buffer accounts for header (~90px) + container padding (~24px) + stats panel (~60px) + gaps/margins (~26px) */}
      <Row gutter={[12, 12]} style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Column: Map + Charts */}
        <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Map Section */}
          <div className="panel-card" style={{ 
            marginBottom: 12, 
            height: '550px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div className="panel-title" style={{ padding: '8px 12px', fontSize: 14 }}>
              🗺️ 井场地形图 - 实时监控
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <TopographicMap wells={wells} />
            </div>
          </div>

          {/* Charts Row */}
          <Row gutter={[12, 12]} style={{ minHeight: '320px' }}>
            <Col span={14}>
              <div className="panel-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-title" style={{ padding: '6px 12px', fontSize: 13 }}>
                  📈 区域故障趋势
                </div>
                <div style={{ 
                  flex: 1,
                  minHeight: '260px', // Ensures sufficient height for chart rendering (container 320px - title ~30px - padding ~16px)
                  background: 'rgba(0, 42, 74, 0.3)', 
                  borderRadius: 8, 
                  padding: '8px',
                  border: '1px solid rgba(0, 200, 255, 0.1)',
                  overflow: 'hidden'
                }}>
                  <AreaFaultTrendChart wells={wells} wellPositions={wellPositions} />
                </div>
              </div>
            </Col>
            
            <Col span={10}>
              <div className="panel-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-title" style={{ padding: '6px 12px', fontSize: 13 }}>
                  🥧 故障分布
                </div>
                <div style={{ 
                  flex: 1,
                  minHeight: '260px', // Ensures sufficient height for chart rendering (container 320px - title ~30px - padding ~16px)
                  background: 'rgba(0, 42, 74, 0.3)', 
                  borderRadius: 8, 
                  padding: '8px',
                  border: '1px solid rgba(0, 200, 255, 0.1)',
                  overflow: 'hidden'
                }}>
                  <AreaFaultDistributionChart wells={wells} wellPositions={wellPositions} />
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Right Column: Alerts + Quick Actions */}
        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Real-time Alerts - Top Right */}
          <div style={{ height: '550px', marginBottom: 12, overflow: 'hidden' }}>
            <RealTimeAlertPanel />
          </div>

          {/* Quick Actions - Bottom Right */}
          <div className="panel-card" style={{ minHeight: '320px', overflow: 'auto' }}>
            <div className="panel-title" style={{ padding: '8px 12px', fontSize: 14 }}>
              🚀 快速导航
            </div>
            <div style={{ padding: '8px' }}>
              <QuickActionCard />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
