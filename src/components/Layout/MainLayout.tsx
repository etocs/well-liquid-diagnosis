import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#001529', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
