import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import ProductionMonitor from './pages/ProductionMonitor';
import DataReport from './pages/DataReport';
import AlarmManagement from './pages/AlarmManagement';
import AlarmHistory from './pages/AlarmHistory';
import CurrentMonitor from './pages/CurrentMonitor';
import LiquidDiagnosis from './pages/LiquidDiagnosis';
import BasicInfo from './pages/BasicInfo';
import SystemSettings from './pages/SystemSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './utils/auth';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ZoomProvider } from './contexts/ZoomContext';
import { AlarmProvider } from './contexts/AlarmContext';
import { SimulationProvider } from './contexts/SimulationContext';

const getDarkTheme = () => ({
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorBgBase: '#001529',
    colorBgContainer: '#002244',
    colorBgElevated: '#002244',
    colorBorder: '#1d3a5c',
    colorText: '#ffffff',
    colorTextSecondary: '#8c9eb5',
    borderRadius: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Table: {
      headerBg: '#003366',
      headerColor: '#00ffff',
      rowHoverBg: '#004488',
      colorBgContainer: '#002244',
    },
    Select: {
      colorBgContainer: '#002244',
      colorBgElevated: '#002244',
    },
    Input: {
      colorBgContainer: '#002244',
    },
    DatePicker: {
      colorBgContainer: '#002244',
      colorBgElevated: '#002244',
    },
    Pagination: {
      itemBg: '#002244',
      itemActiveBg: '#1890ff',
    },
    Card: {
      colorBgContainer: '#002244',
      headerBg: '#003366',
    },
    Modal: {
      contentBg: '#002244',
      headerBg: '#003366',
    },
    Spin: {
      colorPrimary: '#1890ff',
    },
  },
});

const getLightTheme = () => ({
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorBgBase: '#f0f2f5',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorText: '#000000',
    colorTextSecondary: '#666666',
    borderRadius: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Table: {
      headerBg: '#fafafa',
      headerColor: '#000000',
      rowHoverBg: '#f5f5f5',
      colorBgContainer: '#ffffff',
    },
    Select: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
    },
    Input: {
      colorBgContainer: '#ffffff',
    },
    DatePicker: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
    },
    Pagination: {
      itemBg: '#ffffff',
      itemActiveBg: '#1890ff',
    },
    Card: {
      colorBgContainer: '#ffffff',
      headerBg: '#fafafa',
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#fafafa',
    },
    Spin: {
      colorPrimary: '#1890ff',
    },
  },
});

// Route guard: redirect to /login if not authenticated
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { themeMode } = useTheme();
  const antdTheme = themeMode === 'dark' ? getDarkTheme() : getLightTheme();

  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="monitor" element={<ProductionMonitor />} />
            <Route path="monitor/current" element={<CurrentMonitor />} />
            <Route path="monitor/liquid" element={<LiquidDiagnosis />} />
            <Route path="report" element={<DataReport />} />
            <Route path="alarm" element={<AlarmManagement />} />
            <Route path="alarm/history" element={<AlarmHistory />} />
            <Route path="info" element={<BasicInfo />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ZoomProvider>
        <SimulationProvider>
          <AlarmProvider>
            <AppContent />
          </AlarmProvider>
        </SimulationProvider>
      </ZoomProvider>
    </ThemeProvider>
  );
};

export default App;
