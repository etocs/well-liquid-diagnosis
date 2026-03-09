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
import PlaceholderPage from './pages/PlaceholderPage';

const antdTheme = {
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
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="monitor" element={<ProductionMonitor />} />
            <Route path="monitor/current" element={<CurrentMonitor />} />
            <Route path="monitor/liquid" element={<LiquidDiagnosis />} />
            <Route path="report" element={<DataReport />} />
            <Route path="alarm" element={<AlarmManagement />} />
            <Route path="alarm/history" element={<AlarmHistory />} />
            <Route path="info" element={<PlaceholderPage title="基础信息" />} />
            <Route path="system" element={<PlaceholderPage title="系统管理" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
