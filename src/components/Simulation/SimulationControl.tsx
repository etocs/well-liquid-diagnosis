import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Tooltip, Input, Modal, Form, Badge } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useSimulation } from '../../contexts/SimulationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getApiDataService } from '../../services/apiDataService';
import type { RequestLogEntry } from '../../services/apiDataService';
import type { ApiConfig } from '../../types';

const SimulationControl: React.FC = () => {
  const { isSimulationRunning, startSimulation, stopSimulation, resetSimulation } = useSimulation();
  const { themeMode } = useTheme();

  const [apiModalVisible, setApiModalVisible] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>();
  const [logs, setLogs] = useState<RequestLogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm<{ url: string; wellName: string; apiKey: string }>();

  useEffect(() => {
    const svc = getApiDataService();
    const cfg = svc.getConfig();
    if (cfg) {
      form.setFieldsValue({ url: cfg.url, wellName: cfg.wellName, apiKey: cfg.apiKey || '' });
    }
    setApiConnected(svc.getIsConnected());
    setLogs(svc.getLogs());

    const unsubStatus = svc.onStatusChange((connected, error) => {
      setApiConnected(connected);
      setApiError(error);
    });
    const unsubLog = svc.onLogUpdate((entries) => {
      setLogs([...entries]);
    });
    return () => {
      unsubStatus();
      unsubLog();
    };
  }, [form]);

  // Auto-scroll log to bottom on new entries
  useEffect(() => {
    if (apiModalVisible && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, apiModalVisible]);

  const handleConnect = () => {
    form.validateFields().then(values => {
      const config: ApiConfig = {
        url: values.url.trim(),
        wellName: values.wellName.trim(),
        apiKey: values.apiKey?.trim() || undefined,
        enabled: true,
      };
      try {
        localStorage.setItem('apiDataConfig', JSON.stringify(config));
      } catch (_) { /* ignore */ }
      getApiDataService().configure(config);
      // Keep modal open so the user can watch the log
    });
  };

  const handleDisconnect = () => {
    const svc = getApiDataService();
    const cfg = svc.getConfig();
    if (cfg) {
      const updated: ApiConfig = { ...cfg, enabled: false };
      try {
        localStorage.setItem('apiDataConfig', JSON.stringify(updated));
      } catch (_) { /* ignore */ }
      svc.configure(updated);
    } else {
      svc.disconnect();
    }
    setApiConnected(false);
    setApiError(undefined);
  };

  const isDark = themeMode === 'dark';
  const panelBg = isDark ? '#002244' : '#ffffff';
  const panelBorder = isDark ? '1px solid #1d3a5c' : '1px solid #d9d9d9';
  const labelColor = isDark ? '#8c9eb5' : '#666666';

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        background: panelBg,
        border: panelBorder,
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        minWidth: 170,
      }}>
        {/* ---- Simulation controls ---- */}
        <div style={{ color: labelColor, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
          数据模拟控制
        </div>
        <Space>
          {!isSimulationRunning ? (
            <Tooltip title="启动模拟">
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={startSimulation} size="small">
                启动
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="暂停模拟">
              <Button danger icon={<PauseCircleOutlined />} onClick={stopSimulation} size="small">
                暂停
              </Button>
            </Tooltip>
          )}
          <Tooltip title="重置数据">
            <Button icon={<ReloadOutlined />} onClick={resetSimulation} size="small">
              重置
            </Button>
          </Tooltip>
        </Space>
        <div style={{ marginTop: 8, fontSize: 11, color: isSimulationRunning ? '#52c41a' : '#ff4d4f' }}>
          状态: {isSimulationRunning ? '运行中' : '已暂停'}
        </div>

        {/* ---- Divider ---- */}
        <div style={{ borderTop: panelBorder, margin: '10px 0' }} />

        {/* ---- API data integration ---- */}
        <div style={{ color: labelColor, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
          实测数据接入
        </div>
        <Space>
          <Tooltip title="配置实测数据API">
            <Badge dot={apiConnected} color="#52c41a" offset={[-2, 2]}>
              <Button
                icon={<ApiOutlined />}
                onClick={() => setApiModalVisible(true)}
                size="small"
                type={apiConnected ? 'default' : 'dashed'}
              >
                配置
              </Button>
            </Badge>
          </Tooltip>
          {apiConnected && (
            <Tooltip title="断开API连接">
              <Button icon={<DisconnectOutlined />} onClick={handleDisconnect} size="small" danger>
                断开
              </Button>
            </Tooltip>
          )}
        </Space>
        <div style={{ marginTop: 8, fontSize: 11 }}>
          API状态:{' '}
          {apiConnected ? (
            <span style={{ color: '#52c41a' }}>
              <CheckCircleOutlined /> 已连接
            </span>
          ) : (
            <span style={{ color: apiError ? '#ff4d4f' : '#8c9eb5' }}>
              <CloseCircleOutlined /> {apiError ? '错误' : '未连接'}
            </span>
          )}
        </div>
        {apiError && !apiConnected && (
          <div style={{ fontSize: 10, color: '#ff7875', marginTop: 2, wordBreak: 'break-all', maxWidth: 170 }}>
            {apiError}
          </div>
        )}
      </div>

      {/* ---- API Config Modal ---- */}
      <Modal
        title={
          <span>
            <ApiOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            实测数据API配置
          </span>
        }
        open={apiModalVisible}
        onCancel={() => setApiModalVisible(false)}
        width={520}
        footer={[
          <Button key="clear" icon={<ClearOutlined />} onClick={() => getApiDataService().clearLogs()} size="small">
            清空日志
          </Button>,
          <Button key="cancel" onClick={() => setApiModalVisible(false)}>
            关闭
          </Button>,
          apiConnected ? (
            <Button key="disconnect" danger icon={<DisconnectOutlined />} onClick={handleDisconnect}>
              断开连接
            </Button>
          ) : (
            <Button key="connect" type="primary" icon={<ApiOutlined />} onClick={handleConnect}>
              连接
            </Button>
          ),
        ]}
      >
        <div style={{ marginBottom: 12, fontSize: 13, color: '#8c9eb5', lineHeight: 1.6 }}>
          填写实测数据接口地址后点击「连接」，系统将每秒从该接口拉取电流和电阻值，并自动进行积液故障诊断，
          该井段数据将与模拟数据一同展示在所有页面中。
        </div>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#8c9eb5' }}>
          接口需返回 JSON：
          <code style={{ marginLeft: 4, fontSize: 11, background: '#001529', padding: '2px 6px', borderRadius: 4 }}>
            {'{ "wellName": "xxx", "current": 18.5, "resistance": 850 }'}
          </code>
        </div>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="接口地址 (URL)"
            name="url"
            rules={[{ required: true, message: '请填写接口地址' }]}
          >
            <Input placeholder="http://your-api-host/api/realtime" />
          </Form.Item>
          <Form.Item
            label="井名称（覆盖接口返回的 wellName）"
            name="wellName"
            rules={[{ required: true, message: '请填写井名称' }]}
          >
            <Input placeholder="例如：E区-实测井" />
          </Form.Item>
          <Form.Item label="API Key（可选）" name="apiKey">
            <Input.Password placeholder="Bearer Token（如无可留空）" />
          </Form.Item>
        </Form>

        {/* ---- Request Log Panel ---- */}
        <div style={{ marginTop: 4 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <span style={{ fontSize: 12, color: '#8c9eb5', fontWeight: 600 }}>请求日志</span>
            <span style={{ fontSize: 11, color: '#8c9eb5' }}>
              {apiConnected ? (
                <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> 已连接</span>
              ) : (
                <span style={{ color: apiError ? '#ff4d4f' : '#8c9eb5' }}>
                  <CloseCircleOutlined /> {apiError ? `错误: ${apiError}` : '未连接'}
                </span>
              )}
            </span>
          </div>
          <div style={{
            background: '#000d1a',
            border: '1px solid #1d3a5c',
            borderRadius: 6,
            padding: '8px 10px',
            height: 180,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: 11,
            lineHeight: 1.6,
          }}>
            {logs.length === 0 ? (
              <span style={{ color: '#4a6380' }}>暂无日志。点击「连接」后请求记录将显示在此处。</span>
            ) : (
              logs.map((entry, i) => (
                <div key={i} style={{
                  color: entry.level === 'success' ? '#52c41a'
                    : entry.level === 'error' ? '#ff4d4f'
                    : '#8c9eb5',
                  marginBottom: 2,
                  wordBreak: 'break-all',
                }}>
                  <span style={{ color: '#4a6380', marginRight: 6 }}>{entry.time}</span>
                  <span style={{
                    marginRight: 6,
                    color: entry.level === 'success' ? '#52c41a'
                      : entry.level === 'error' ? '#ff4d4f'
                      : '#1890ff',
                  }}>
                    [{entry.level === 'success' ? 'OK ' : entry.level === 'error' ? 'ERR' : 'INF'}]
                  </span>
                  {entry.message}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SimulationControl;
