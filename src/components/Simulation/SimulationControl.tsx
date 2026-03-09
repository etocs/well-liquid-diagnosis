import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSimulation } from '../../contexts/SimulationContext';
import { useTheme } from '../../contexts/ThemeContext';

const SimulationControl: React.FC = () => {
  const { isSimulationRunning, startSimulation, stopSimulation, resetSimulation } = useSimulation();
  const { themeMode } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      background: themeMode === 'dark' ? '#002244' : '#ffffff',
      border: themeMode === 'dark' ? '1px solid #1d3a5c' : '1px solid #d9d9d9',
      borderRadius: 8,
      padding: '12px 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ 
        color: themeMode === 'dark' ? '#8c9eb5' : '#666666', 
        fontSize: 12, 
        marginBottom: 8,
        fontWeight: 600,
      }}>
        数据模拟控制
      </div>
      <Space>
        {!isSimulationRunning ? (
          <Tooltip title="启动模拟">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={startSimulation}
              size="small"
            >
              启动
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="暂停模拟">
            <Button
              danger
              icon={<PauseCircleOutlined />}
              onClick={stopSimulation}
              size="small"
            >
              暂停
            </Button>
          </Tooltip>
        )}
        <Tooltip title="重置数据">
          <Button
            icon={<ReloadOutlined />}
            onClick={resetSimulation}
            size="small"
          >
            重置
          </Button>
        </Tooltip>
      </Space>
      <div style={{ 
        marginTop: 8,
        fontSize: 11,
        color: isSimulationRunning ? '#52c41a' : '#ff4d4f',
      }}>
        状态: {isSimulationRunning ? '运行中' : '已暂停'}
      </div>
    </div>
  );
};

export default SimulationControl;
