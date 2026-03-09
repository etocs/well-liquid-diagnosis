import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/auth';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      const result = login(values.username, values.password);
      if (result.ok) {
        message.success('登录成功，欢迎回来！');
        navigate('/', { replace: true });
      } else {
        message.error(result.message);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, #001f4d 0%, #001529 40%, #000d1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* 大圆 */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24,144,255,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)',
        }} />
        {/* 网格 */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1890ff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 登录卡片 */}
      <div style={{
        width: 420,
        background: 'linear-gradient(145deg, rgba(0,34,68,0.95), rgba(0,21,41,0.98))',
        border: '1px solid rgba(24,144,255,0.3)',
        borderRadius: 16,
        padding: '40px 44px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(24,144,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* 顶部光晕 */}
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(24,144,255,0.6), transparent)',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #1890ff, #00c6ff)',
            borderRadius: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(24,144,255,0.4)',
          }}>
            💧
          </div>
          <h1 style={{
            color: '#00ffff',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            margin: '0 0 6px',
          }}>
            井下积液工况诊断系统
          </h1>
          <p style={{ color: '#6b8aab', fontSize: 13, margin: 0 }}>
            Well Liquid Diagnosis Platform
          </p>
        </div>

        {/* 表单 */}
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ username: 'admin', password: 'admin123', remember: true }}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="用户名"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(24,144,255,0.3)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="密码"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(24,144,255,0.3)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#8c9eb5' }}>记住我</Checkbox>
              </Form.Item>
              <a style={{ color: '#1890ff', fontSize: 13 }}>忘记密码？</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<LoginOutlined />}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1890ff, #0050b3)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(24,144,255,0.4)',
                letterSpacing: 1,
              }}
            >
              登 录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#6b8aab', fontSize: 13 }}>
            还没有账号？{' '}
            <Link to="/register" style={{ color: '#1890ff', fontWeight: 600 }}>
              立即注册
            </Link>
          </div>
        </Form>

        {/* 底部提示 */}
        <div style={{
          marginTop: 24,
          padding: '10px 14px',
          background: 'rgba(24,144,255,0.06)',
          border: '1px solid rgba(24,144,255,0.12)',
          borderRadius: 8,
          color: '#6b8aab',
          fontSize: 12,
          textAlign: 'center',
        }}>
          默认账号：admin / admin123
        </div>
      </div>
    </div>
  );
};

export default Login;
