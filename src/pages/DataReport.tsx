import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import StatisticsPanel from '../components/Dashboard/StatisticsPanel';
import WellboreDiagram from '../components/WellDiagram/WellboreDiagram';
import CurrentChart from '../components/Charts/CurrentChart';
import type { Well, Statistics, MonitorDataPoint } from '../types';
import { getWells, getStatistics, getMonitorData } from '../services/api';
import { useSimulation } from '../contexts/SimulationContext';
import { getApiDataService, API_WELL_ID } from '../services/apiDataService';

const DataReport: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [dataMap, setDataMap] = useState<Record<string, MonitorDataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const { isSimulationRunning } = useSimulation();

  // Initial load
  useEffect(() => {
    Promise.all([getWells(), getStatistics()]).then(async ([w, s]) => {
      setWells(w);
      setStats(s);
      // 加载所有井筒数据
      const map: Record<string, MonitorDataPoint[]> = {};
      await Promise.all(w.map(async well => {
        map[well.id] = await getMonitorData(well.id);
      }));
      setDataMap(map);
      setLoading(false);
    });
  }, []);

  // Subscribe to API data service updates so the API well appears even without simulation
  useEffect(() => {
    const apiSvc = getApiDataService();
    const unsubscribe = apiSvc.onUpdate((apiWells) => {
      if (apiWells.length > 0) {
        const apiWell = apiWells[0];
        setWells(prev => {
          const exists = prev.some(w => w.id === apiWell.id);
          if (!exists) return [...prev, apiWell];
          return prev.map(w => (w.id === apiWell.id ? apiWell : w));
        });
        setDataMap(prev => ({
          ...prev,
          [apiWell.id]: apiSvc.getCurrentHistory(),
        }));
        // Refresh statistics to include the new well
        getStatistics().then(s => setStats(s));
      } else {
        // API disconnected – remove API well
        setWells(prev => prev.filter(w => w.id !== API_WELL_ID));
        setDataMap(prev => {
          const next = { ...prev };
          delete next[API_WELL_ID];
          return next;
        });
        getStatistics().then(s => setStats(s));
      }
    });
    return unsubscribe;
  }, []);

  // Refresh data periodically when simulation is running
  useEffect(() => {
    if (!isSimulationRunning || wells.length === 0) return;

    let isRefreshing = false;
    
    const refresh = async () => {
      if (isRefreshing) return; // Prevent overlapping requests
      
      isRefreshing = true;
      try {
        // Refresh statistics
        const s = await getStatistics();
        setStats(s);
        
        // Refresh well data and monitor data
        const w = await getWells();
        setWells(w);
        
        const map: Record<string, MonitorDataPoint[]> = {};
        await Promise.all(w.map(async well => {
          map[well.id] = await getMonitorData(well.id);
        }));
        setDataMap(map);
      } finally {
        isRefreshing = false;
      }
    };

    const refreshInterval = window.setInterval(refresh, 3000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSimulationRunning, wells.length]); // Use wells.length to avoid recreating interval

  return (
    <div className="page-container">
      <div className="panel-card">
        <div className="panel-title">数据大屏 - 综合报表</div>
        {stats && <StatisticsPanel stats={stats} />}
      </div>

      <div className="panel-card">
        <div className="panel-title">各井筒积液状态</div>
        <Row gutter={[8, 8]}>
          {wells.map(well => (
            <Col key={well.id} xs={12} sm={8} md={6} lg={4}>
              <WellboreDiagram well={well} />
            </Col>
          ))}
        </Row>
      </div>

      {!loading && (
        <div className="panel-card">
          <div className="panel-title">各井筒电流对比</div>
          <Row gutter={[12, 12]}>
            {wells.map(well => (
              <Col key={well.id} xs={24} md={12} xl={8}>
                <div style={{
                  background: '#001529',
                  border: '1px solid #1d3a5c',
                  borderRadius: 6,
                  padding: '10px',
                }}>
                  <div style={{ color: '#00ffff', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    {well.name}
                  </div>
                  <CurrentChart data={dataMap[well.id] || []} height={160} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default DataReport;
