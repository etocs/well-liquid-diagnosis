import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../utils/auth';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { username: string; displayName: string; password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      message.error('两次密码不一致');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register(values.username, values.password, values.displayName);
      if (result.ok) {
        message.success('注册成功，已自动登录！');
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
      background: 'radial-gradient(ellipse at 80% 50%, #001f4d 0%, #001529 40%, #000d1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(24,144,255,0.05) 0%, transparent 70%)',
        }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00ffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>

      {/* 注册卡片 */}
      <div style={{
        width: 440,
        background: 'linear-gradient(145deg, rgba(0,34,68,0.95), rgba(0,21,41,0.98))',
        border: '1px solid rgba(0,255,255,0.2)',
        borderRadius: 16,
        padding: '40px 44px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* 顶部光晕 */}
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #00c6ff, #00ffff)',
            borderRadius: 14,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            marginBottom: 14,
            boxShadow: '0 8px 24px rgba(0,255,255,0.3)',
          }}>
            💧
          </div>
          <h1 style={{
            color: '#00ffff',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            margin: '0 0 6px',
          }}>
            注册新账号
          </h1>
          <p style={{ color: '#6b8aab', fontSize: 13, margin: 0 }}>
            井下积液工况诊断系统
          </p>
        </div>

        {/* 表单 */}
        <Form
          name="register"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="displayName"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#00ffff' }} />}
              placeholder="真实姓名 / 昵称"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(0,255,255,0.2)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3位' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#00ffff' }} />}
              placeholder="用户名（≥3位）"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(0,255,255,0.2)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#00ffff' }} />}
              placeholder="密码（≥6位）"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(0,255,255,0.2)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            rules={[{ required: true, message: '请再次输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#00ffff' }} />}
              placeholder="确认密码"
              style={{
                background: 'rgba(0,34,68,0.8)',
                border: '1px solid rgba(0,255,255,0.2)',
                borderRadius: 8,
                color: '#fff',
                height: 46,
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<UserAddOutlined />}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,180,216,0.4)',
                letterSpacing: 1,
              }}
            >
              立即注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', color: '#6b8aab', fontSize: 13 }}>
            已有账号？{' '}
            <Link to="/login" style={{ color: '#1890ff', fontWeight: 600 }}>
              返回登录
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
