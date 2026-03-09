import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  AlertOutlined,
  LogoutOutlined,
  BulbOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Badge, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { logout, getCurrentUser } from '../../utils/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { useZoom } from '../../contexts/ZoomContext';
import { useAlarm } from '../../contexts/AlarmContext';

const NAV_ITEMS = [
  { key: '/', label: '系统首页' },
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
  const user = getCurrentUser();
  const { themeMode, toggleTheme } = useTheme();
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();
  const { hasActiveAlarm, alarmCount, acknowledgeAlarms } = useAlarm();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const path = location.pathname || '/';
  const activeKey = React.useMemo(() => {
    if (path === '/') return '/';
    return NAV_ITEMS.find(item => item.key !== '/' && path.startsWith(item.key))?.key ?? '/';
  }, [path]);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <span style={{ color: themeMode === 'dark' ? '#c8d8e8' : '#333333' }}>个人信息</span>,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: <span style={{ color: '#ff4d4f' }}>退出登录</span>,
      icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      onClick: () => {
        logout();
        navigate('/login', { replace: true });
      },
    },
  ];

  const handleAlarmClick = () => {
    acknowledgeAlarms();
    navigate('/alarm');
  };

  return (
    <header style={{
      height: 56,
      background: themeMode === 'dark' 
        ? 'linear-gradient(90deg, #001529 0%, #002244 50%, #001529 100%)'
        : 'linear-gradient(90deg, #ffffff 0%, #f0f2f5 50%, #ffffff 100%)',
      borderBottom: themeMode === 'dark' ? '1px solid #1d3a5c' : '1px solid #d9d9d9',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
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
          <div style={{ 
            color: themeMode === 'dark' ? '#00ffff' : '#1890ff', 
            fontSize: 16, 
            fontWeight: 700, 
            lineHeight: 1.2, 
            letterSpacing: 1 
          }}>
            井下积液诊断系统
          </div>
          <div style={{ color: themeMode === 'dark' ? '#8c9eb5' : '#666666', fontSize: 11 }}>
            Well Liquid Diagnosis Platform
          </div>
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
              color: activeKey === item.key 
                ? '#1890ff' 
                : (themeMode === 'dark' ? '#c8d8e8' : '#666666'),
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
                (e.currentTarget as HTMLButtonElement).style.color = themeMode === 'dark' ? '#ffffff' : '#000000';
                (e.currentTarget as HTMLButtonElement).style.background = themeMode === 'dark' ? '#ffffff11' : '#f0f2f5';
              }
            }}
            onMouseLeave={e => {
              if (activeKey !== item.key) {
                (e.currentTarget as HTMLButtonElement).style.color = themeMode === 'dark' ? '#c8d8e8' : '#666666';
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
        <Tooltip title="告警通知">
          <button 
            style={{
              ...iconBtnStyle,
              background: hasActiveAlarm ? '#ff4d4f22' : 'transparent',
              animation: hasActiveAlarm ? 'flash 1s infinite' : 'none',
            }}
            onClick={handleAlarmClick}
          >
            <Badge count={alarmCount} size="small">
              <AlertOutlined style={{ 
                fontSize: 16, 
                color: hasActiveAlarm ? '#ff4d4f' : (themeMode === 'dark' ? '#8c9eb5' : '#666666')
              }} />
            </Badge>
          </button>
        </Tooltip>

        <Tooltip title={themeMode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}>
          <button style={iconBtnStyle} onClick={toggleTheme}>
            <BulbOutlined style={{ 
              fontSize: 16, 
              color: themeMode === 'dark' ? '#faad14' : '#1890ff'
            }} />
          </button>
        </Tooltip>

        <Tooltip title="放大">
          <button style={iconBtnStyle} onClick={zoomIn}>
            <ZoomInOutlined style={{ 
              fontSize: 16, 
              color: themeMode === 'dark' ? '#8c9eb5' : '#666666'
            }} />
          </button>
        </Tooltip>

        <Tooltip title={`缩放: ${Math.round(zoomLevel * 100)}%`}>
          <button style={iconBtnStyle} onClick={resetZoom}>
            <SyncOutlined style={{ 
              fontSize: 16, 
              color: themeMode === 'dark' ? '#8c9eb5' : '#666666'
            }} />
          </button>
        </Tooltip>

        <Tooltip title="缩小">
          <button style={iconBtnStyle} onClick={zoomOut}>
            <ZoomOutOutlined style={{ 
              fontSize: 16, 
              color: themeMode === 'dark' ? '#8c9eb5' : '#666666'
            }} />
          </button>
        </Tooltip>

        <Tooltip title={isFullscreen ? '退出全屏' : '全屏显示'}>
          <button style={iconBtnStyle} onClick={toggleFullscreen}>
            {isFullscreen
              ? <FullscreenExitOutlined style={{ 
                  fontSize: 16, 
                  color: themeMode === 'dark' ? '#8c9eb5' : '#666666'
                }} />
              : <FullscreenOutlined style={{ 
                  fontSize: 16, 
                  color: themeMode === 'dark' ? '#8c9eb5' : '#666666'
                }} />
            }
          </button>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: 6,
            border: themeMode === 'dark' ? '1px solid #1d3a5c' : '1px solid #d9d9d9',
            background: themeMode === 'dark' ? '#002244' : '#ffffff',
            transition: 'border-color 0.2s',
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
            <span style={{ 
              color: themeMode === 'dark' ? '#c8d8e8' : '#333333', 
              fontSize: 13 
            }}>
              {user?.displayName || '管理员'}
            </span>
          </div>
        </Dropdown>
      </div>
      <style>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
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
