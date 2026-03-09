import React from 'react';
import { Row, Col } from 'antd';
import type { Statistics } from '../../types';

interface StatItemProps {
  label: string;
  value: number | string;
  unit?: string;
  color?: string;
  icon?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, unit, color = '#ffffff', icon }) => (
  <div style={{
    background: '#002244',
    border: '1px solid #1d3a5c',
    borderRadius: 8,
    padding: '16px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    }} />
    {icon && <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>}
    <div style={{ color: '#8c9eb5', fontSize: 12, marginBottom: 8 }}>{label}</div>
    <div style={{ color, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
      {value}
      {unit && <span style={{ fontSize: 14, marginLeft: 4, color: '#8c9eb5' }}>{unit}</span>}
    </div>
  </div>
);

interface Props {
  stats: Statistics;
}

const StatisticsPanel: React.FC<Props> = ({ stats }) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={6}>
        <StatItem label="井筒总数" value={stats.totalWells} unit="口" color="#1890ff" icon="🛢️" />
      </Col>
      <Col span={6}>
        <StatItem label="正常运行" value={stats.normalWells} unit="口" color="#52c41a" icon="✅" />
      </Col>
      <Col span={6}>
        <StatItem label="预警井数" value={stats.warningWells} unit="口" color="#faad14" icon="⚠️" />
      </Col>
      <Col span={6}>
        <StatItem label="故障井数" value={stats.faultWells} unit="口" color="#ff4d4f" icon="🚨" />
      </Col>
      <Col span={6}>
        <StatItem label="平均积液高度" value={stats.avgLiquidHeight} unit="m" color="#00ffff" icon="💧" />
      </Col>
      <Col span={6}>
        <StatItem label="预警总数" value={stats.totalAlarms} unit="条" color="#1890ff" icon="📋" />
      </Col>
      <Col span={6}>
        <StatItem label="未处理预警" value={stats.unprocessedAlarms} unit="条" color="#ff4d4f" icon="🔔" />
      </Col>
      <Col span={6}>
        <StatItem
          label="处理率"
          value={stats.totalAlarms > 0
            ? Math.round(((stats.totalAlarms - stats.unprocessedAlarms) / stats.totalAlarms) * 100)
            : 100}
          unit="%"
          color="#52c41a"
          icon="📊"
        />
      </Col>
    </Row>
  );
};

export default StatisticsPanel;
