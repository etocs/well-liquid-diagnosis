import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Switch, Select, Button, message, Card, Row, Col, Divider } from 'antd';
import {
  BellOutlined,
  SoundOutlined,
  WechatOutlined,
  ApiOutlined,
  RobotOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { SystemSettings, defaultSettings } from '../utils/settings';

const { Option } = Select;

const SystemSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        form.setFieldsValue(parsed);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('systemSettings', JSON.stringify(values));
      setSettings(values);
      
      setTimeout(() => {
        message.success('系统设置已保存');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('请检查输入是否正确');
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
    localStorage.setItem('systemSettings', JSON.stringify(defaultSettings));
    setSettings(defaultSettings);
    message.info('已恢复默认设置');
  };

  return (
    <div className="page-container">
      <div style={{
        background: 'linear-gradient(135deg, #002244, #003366)',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <h1 style={{ color: '#00ffff', fontSize: 24, fontWeight: 600, margin: 0 }}>
          系统管理
        </h1>
        <p style={{ color: '#8c9eb5', fontSize: 14, margin: '8px 0 0 0' }}>
          配置报警设置、推送通知和AI辅助决策系统
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <BellOutlined style={{ marginRight: 8 }} />
                报警设置
              </span>
            }
            className="panel-card"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={settings}
            >
              <Form.Item
                label="报警时间间隔"
                name="alarmInterval"
                rules={[{ required: true, message: '请输入报警时间间隔' }]}
                extra="设置报警提醒的时间间隔（秒）"
              >
                <InputNumber
                  min={5}
                  max={300}
                  step={5}
                  style={{ width: '100%' }}
                  addonAfter="秒"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <SoundOutlined style={{ marginRight: 8 }} />
                    报警声音大小
                  </span>
                }
                name="alarmVolume"
                rules={[{ required: true, message: '请设置报警声音大小' }]}
                extra="调整报警提示音的音量（0-100）"
              >
                <InputNumber
                  min={0}
                  max={100}
                  step={5}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <ApiOutlined style={{ marginRight: 8 }} />
                推送通知设置
              </span>
            }
            className="panel-card"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={settings}
            >
              <Form.Item
                label="启用推送通知"
                name="pushEnabled"
                valuePropName="checked"
                extra="开启后将向配置的平台推送预警信息"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="推送平台"
                name="pushType"
                rules={[{ required: true, message: '请选择推送平台' }]}
              >
                <Select
                  placeholder="选择推送平台"
                  disabled={!form.getFieldValue('pushEnabled')}
                >
                  <Option value="none">
                    <span>不推送</span>
                  </Option>
                  <Option value="wechat">
                    <WechatOutlined style={{ marginRight: 8, color: '#07c160' }} />
                    企业微信
                  </Option>
                  <Option value="dingtalk">
                    <ApiOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    钉钉
                  </Option>
                  <Option value="feishu">
                    <ApiOutlined style={{ marginRight: 8, color: '#00d6b9' }} />
                    飞书
                  </Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <span>
                <RobotOutlined style={{ marginRight: 8 }} />
                AI辅助决策系统
              </span>
            }
            className="panel-card"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={settings}
            >
              <Form.Item
                label="启用AI辅助决策"
                name="aiDecisionEnabled"
                valuePropName="checked"
                extra={
                  <div>
                    开启后，当检测到预警信息时，系统将在异常管理界面弹出AI辅助决策提示。
                    <br />
                    AI将根据预警信息自动生成应对措施建议（如启动雾化、调整参数等），帮助快速处理异常情况。
                  </div>
                }
              >
                <Switch checkedChildren="已启用" unCheckedChildren="已关闭" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={loading}
          size="large"
          style={{ marginRight: 16 }}
        >
          保存设置
        </Button>
        <Button
          onClick={handleReset}
          size="large"
        >
          恢复默认
        </Button>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
