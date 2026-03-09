import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  BulbOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';

const NAV_ITEMS = [
  { key: '/', label: '平台首页' },
  { key: '/monitor', label: '生产监控' },
  { key: '/report', label: '数据报表' },
  { key: '/alarm', label: '异常管理' },
  { key: '/info', label: '基础信息' },
  { key: '/system', label: '系统管理' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const activeKey = NAV_ITEMS.find(item =>
    item.key === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.key)
  )?.key;

  return (
    <header style={{
      height: 56,
      background: 'linear-gradient(90deg, #001529 0%, #002244 50%, #001529 100%)',
      borderBottom: '1px solid #1d3a5c',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      {/* Logo & 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
        <div style={{
          width: 36,
          height: 36,
          background: 'linear-gradient(135deg, #1890ff, #00ffff)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          💧
        </div>
        <div>
          <div style={{ color: '#00ffff', fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: 1 }}>
            井下积液诊断系统
          </div>
          <div style={{ color: '#8c9eb5', fontSize: 11 }}>Well Liquid Diagnosis Platform</div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            style={{
              background: activeKey === item.key
                ? 'linear-gradient(135deg, #1890ff33, #1890ff22)'
                : 'transparent',
              border: activeKey === item.key ? '1px solid #1890ff66' : '1px solid transparent',
              color: activeKey === item.key ? '#1890ff' : '#c8d8e8',
              padding: '6px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeKey === item.key ? 600 : 400,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (activeKey !== item.key) {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.background = '#ffffff11';
              }
            }}
            onMouseLeave={e => {
              if (activeKey !== item.key) {
                (e.currentTarget as HTMLButtonElement).style.color = '#c8d8e8';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }
            }}
          >
            {item.key === '/alarm' ? (
              <Badge count={2} size="small" offset={[6, -2]}>
                {item.label}
              </Badge>
            ) : item.label}
          </button>
        ))}
      </nav>

      {/* 右侧工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Tooltip title="暗色/亮色模式">
          <button style={iconBtnStyle}>
            <BulbOutlined style={{ fontSize: 16, color: '#faad14' }} />
          </button>
        </Tooltip>

        <Tooltip title="告警通知">
          <button style={iconBtnStyle}>
            <Badge count={4} size="small">
              <AlertOutlined style={{ fontSize: 16, color: '#ff4d4f' }} />
            </Badge>
          </button>
        </Tooltip>

        <Tooltip title={isFullscreen ? '退出全屏' : '全屏显示'}>
          <button style={iconBtnStyle} onClick={toggleFullscreen}>
            {isFullscreen
              ? <FullscreenExitOutlined style={{ fontSize: 16, color: '#8c9eb5' }} />
              : <FullscreenOutlined style={{ fontSize: 16, color: '#8c9eb5' }} />
            }
          </button>
        </Tooltip>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '4px 10px',
          borderRadius: 6,
          border: '1px solid #1d3a5c',
          background: '#002244',
        }}>
          <div style={{
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #1890ff, #0050b3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <UserOutlined style={{ fontSize: 14, color: 'white' }} />
          </div>
          <span style={{ color: '#c8d8e8', fontSize: 13 }}>管理员</span>
        </div>
      </div>
    </header>
  );
};

const iconBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
};

export default Header;
