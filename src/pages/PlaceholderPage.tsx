import React from 'react';
import { Result } from 'antd';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Result
      icon={<span style={{ fontSize: 48 }}>🚧</span>}
      title={<span style={{ color: '#00ffff' }}>{title}</span>}
      subTitle={<span style={{ color: '#8c9eb5' }}>功能开发中，敬请期待...</span>}
    />
  </div>
);

export default PlaceholderPage;
