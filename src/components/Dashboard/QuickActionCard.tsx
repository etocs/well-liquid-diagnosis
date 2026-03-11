import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChartOutlined,
  ThunderboltOutlined,
  AreaChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  description: string;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: '生产监控',
    icon: <LineChartOutlined />,
    description: '实时监测井筒运行状态',
    path: '/monitor',
    color: '#1890ff',
  },
  {
    title: '电流实况',
    icon: <ThunderboltOutlined />,
    description: '查看涡轮机电流数据',
    path: '/monitor/current',
    color: '#52c41a',
  },
  {
    title: '数据报表',
    icon: <AreaChartOutlined />,
    description: '综合数据分析大屏',
    path: '/report',
    color: '#faad14',
  },
  {
    title: '系统管理',
    icon: <SettingOutlined />,
    description: '系统配置与参数设置',
    path: '/system',
    color: '#722ed1',
  },
];

const QuickActionCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 12,
    }}>
      {quickActions.map(action => (
        <div
          key={action.path}
          onClick={() => navigate(action.path)}
          style={{
            background: 'linear-gradient(135deg, #001529, #002a4a)',
            border: `1px solid ${action.color}33`,
            borderRadius: 8,
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = action.color;
            e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}44`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = `${action.color}33`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${action.color}, transparent)`,
          }} />
          
          <div style={{
            fontSize: 28,
            color: action.color,
            marginBottom: 8,
          }}>
            {action.icon}
          </div>
          
          <div style={{
            color: '#00ffff',
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 4,
          }}>
            {action.title}
          </div>
          
          <div style={{
            color: '#8c9eb5',
            fontSize: 12,
            lineHeight: 1.5,
          }}>
            {action.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActionCard;
