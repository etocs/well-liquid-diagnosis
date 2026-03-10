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
    <div className="page-container">
      {/* Hero Section with Title and Key Stats */}
      <div style={{
        background: themeMode === 'dark' 
          ? 'linear-gradient(135deg, #001529, #003366, #001529)'
          : 'linear-gradient(135deg, #e6f7ff, #bae7ff)',
        border: themeMode === 'dark' ? '1px solid #1d3a5c' : '1px solid #91d5ff',
        borderRadius: 12,
        padding: '24px',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.1), transparent)',
          animation: 'pulse 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24,144,255,0.1), transparent)',
          animation: 'pulse 4s ease-in-out infinite 1s',
        }} />
        
        <h1 style={{ 
          color: themeMode === 'dark' ? '#00ffff' : '#1890ff', 
          fontSize: 28, 
          fontWeight: 700, 
          marginBottom: 8,
          textShadow: '0 2px 8px rgba(0, 255, 255, 0.3)',
          zIndex: 1,
          position: 'relative',
        }}>
          💧 井下积液工况智能监控平台
        </h1>
        <p style={{ 
          color: themeMode === 'dark' ? '#8c9eb5' : '#666666', 
          fontSize: 15, 
          margin: 0,
          zIndex: 1,
          position: 'relative',
        }}>
          Real-time Intelligent Well Liquid Diagnosis System | 实时监测 · 智能诊断 · 预警管理
        </p>
      </div>

      {/* Key Metrics - Large Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} lg={6}>
            <div style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 12,
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, transparent, #1890ff, transparent)',
              }} />
              <DashboardOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 12 }} />
              <div style={{ color: '#8c9eb5', fontSize: 13, marginBottom: 8 }}>井筒总数</div>
              <div style={{ color: '#1890ff', fontSize: 36, fontWeight: 700 }}>
                {stats.totalWells}
                <span style={{ fontSize: 16, marginLeft: 6, color: '#8c9eb5' }}>口</span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 12,
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, transparent, #52c41a, transparent)',
              }} />
              <CheckCircleOutlined style={{ fontSize: 36, color: '#52c41a', marginBottom: 12 }} />
              <div style={{ color: '#8c9eb5', fontSize: 13, marginBottom: 8 }}>正常运行</div>
              <div style={{ color: '#52c41a', fontSize: 36, fontWeight: 700 }}>
                {stats.normalWells}
                <span style={{ fontSize: 16, marginLeft: 6, color: '#8c9eb5' }}>口</span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 12,
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, transparent, #faad14, transparent)',
              }} />
              <ThunderboltOutlined style={{ fontSize: 36, color: '#faad14', marginBottom: 12 }} />
              <div style={{ color: '#8c9eb5', fontSize: 13, marginBottom: 8 }}>异常告警</div>
              <div style={{ color: '#faad14', fontSize: 36, fontWeight: 700 }}>
                {stats.warningWells + stats.faultWells}
                <span style={{ fontSize: 16, marginLeft: 6, color: '#8c9eb5' }}>口</span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 12,
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
              }} />
              <ExperimentOutlined style={{ fontSize: 36, color: '#00ffff', marginBottom: 12 }} />
              <div style={{ color: '#8c9eb5', fontSize: 13, marginBottom: 8 }}>平均积液</div>
              <div style={{ color: '#00ffff', fontSize: 36, fontWeight: 700 }}>
                {stats.avgLiquidHeight.toFixed(0)}
                <span style={{ fontSize: 16, marginLeft: 6, color: '#8c9eb5' }}>mm</span>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Main Content: Map and Alert Panel */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={18}>
          <div className="panel-card">
            <div className="panel-title">井场地形图 - 实时监控</div>
            <TopographicMap wells={wells} />
          </div>
        </Col>
        
        <Col xs={24} lg={6}>
          <RealTimeAlertPanel />
        </Col>
      </Row>

      {/* Area Fault Analytics - Trend and Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={14}>
          <div className="panel-card">
            <div className="panel-title" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <span style={{ fontSize: 18 }}>📈</span>
              <span>区域故障趋势分析</span>
              <span style={{ 
                fontSize: 11, 
                color: '#8c9eb5', 
                fontWeight: 400,
                marginLeft: 8 
              }}>
                实时监控各区域故障变化
              </span>
            </div>
            <div style={{ 
              background: 'rgba(0, 42, 74, 0.3)', 
              borderRadius: 8, 
              padding: '16px 12px',
              border: '1px solid rgba(0, 200, 255, 0.1)'
            }}>
              <AreaFaultTrendChart wells={wells} wellPositions={wellPositions} />
            </div>
          </div>
        </Col>
        
        <Col xs={24} lg={10}>
          <div className="panel-card">
            <div className="panel-title" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <span style={{ fontSize: 18 }}>🥧</span>
              <span>区域故障分布</span>
              <span style={{ 
                fontSize: 11, 
                color: '#8c9eb5', 
                fontWeight: 400,
                marginLeft: 8 
              }}>
                各区域故障占比统计
              </span>
            </div>
            <div style={{ 
              background: 'rgba(0, 42, 74, 0.3)', 
              borderRadius: 8, 
              padding: '16px 12px',
              border: '1px solid rgba(0, 200, 255, 0.1)'
            }}>
              <AreaFaultDistributionChart wells={wells} wellPositions={wellPositions} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="panel-card" style={{ marginBottom: 20 }}>
        <div className="panel-title">快速导航</div>
        <QuickActionCard />
      </div>

      {/* System Status Info */}
      <div className="panel-card">
        <div className="panel-title">系统运行状态</div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{
              background: 'rgba(24, 144, 255, 0.05)',
              border: '1px solid rgba(24, 144, 255, 0.2)',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
              <div style={{ color: '#1890ff', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                监控覆盖率
              </div>
              <div style={{ color: '#00ffff', fontSize: 28, fontWeight: 700 }}>
                100%
              </div>
              <div style={{ color: '#8c9eb5', fontSize: 12, marginTop: 4 }}>
                全部井筒实时监控
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              background: 'rgba(82, 196, 26, 0.05)',
              border: '1px solid rgba(82, 196, 26, 0.2)',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
              <div style={{ color: '#52c41a', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                诊断响应时间
              </div>
              <div style={{ color: '#52c41a', fontSize: 28, fontWeight: 700 }}>
                &lt; 3s
              </div>
              <div style={{ color: '#8c9eb5', fontSize: 12, marginTop: 4 }}>
                实时数据更新周期
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              background: 'rgba(250, 173, 20, 0.05)',
              border: '1px solid rgba(250, 173, 20, 0.2)',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={{ color: '#faad14', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                预警处理率
              </div>
              <div style={{ color: '#faad14', fontSize: 28, fontWeight: 700 }}>
                {stats ? Math.round(((stats.totalAlarms - stats.unprocessedAlarms) / (stats.totalAlarms || 1)) * 100) : 0}%
              </div>
              <div style={{ color: '#8c9eb5', fontSize: 12, marginTop: 4 }}>
                {stats ? `${stats.totalAlarms - stats.unprocessedAlarms}/${stats.totalAlarms}` : '0/0'} 已处理
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
