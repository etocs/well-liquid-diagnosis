import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '../../contexts/ThemeContext';
import { useZoom } from '../../contexts/ZoomContext';

const MainLayout: React.FC = () => {
  const { themeMode } = useTheme();
  const { zoomLevel } = useZoom();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: themeMode === 'dark' ? '#001529' : '#f0f2f5', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        overflow: 'auto',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease',
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
