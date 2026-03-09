import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import CurrentChart from '../Charts/CurrentChart';
import type { Well, MonitorDataPoint } from '../../types';
import { getTurbineCurrentData } from '../../services/api';
import { useSimulation } from '../../contexts/SimulationContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  wells: Well[];
}

const TurbineCurrentGrid: React.FC<Props> = ({ wells }) => {
  const [currentData, setCurrentData] = useState<Record<string, MonitorDataPoint[]>>({});
  const { isSimulationRunning } = useSimulation();
  const { themeMode } = useTheme();

  // Load turbine current data for all wells
  useEffect(() => {
    const loadData = async () => {
      const dataPromises = wells.map(well => 
        getTurbineCurrentData(well.id).then(data => ({ wellId: well.id, data }))
      );
      const results = await Promise.all(dataPromises);
      const dataMap: Record<string, MonitorDataPoint[]> = {};
      results.forEach(({ wellId, data }) => {
        dataMap[wellId] = data;
      });
      setCurrentData(dataMap);
    };
    loadData();
  }, [wells]);

  // Refresh data periodically when simulation is running
  useEffect(() => {
    if (!isSimulationRunning) return;

    const refreshInterval = window.setInterval(async () => {
      const dataPromises = wells.map(well => 
        getTurbineCurrentData(well.id).then(data => ({ wellId: well.id, data }))
      );
      const results = await Promise.all(dataPromises);
      const dataMap: Record<string, MonitorDataPoint[]> = {};
      results.forEach(({ wellId, data }) => {
        dataMap[wellId] = data;
      });
      setCurrentData(dataMap);
    }, 3000); // Refresh every 3 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isSimulationRunning, wells]);

  return (
    <Row gutter={[12, 12]}>
      {wells.map(well => {
        const data = currentData[well.id] || [];
        const currentValue = data.length > 0 ? data[data.length - 1].current : well.turbineCurrent;
        const statusColor = well.turbineStatus === 'normal' ? '#52c41a' : 
                           well.turbineStatus === 'unstable' ? '#faad14' : '#ff4d4f';
        
        return (
          <Col key={well.id} xs={24} sm={12} md={12} lg={8}>
            <div style={{
              background: '#001529',
              border: `1px solid ${well.turbineStatus !== 'normal' ? statusColor + '66' : '#1d3a5c'}`,
              borderRadius: 8,
              padding: 12,
            }}>
              {/* Well info header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <div>
                  <div style={{ 
                    color: '#00ffff', 
                    fontSize: 13, 
                    fontWeight: 600,
                  }}>
                    {well.name}
                  </div>
                  <div style={{ 
                    color: '#8c9eb5', 
                    fontSize: 11,
                  }}>
                    涡轮机电流: <span style={{ 
                      color: statusColor, 
                      fontWeight: 700,
                      fontSize: 12,
                    }}>
                      {currentValue.toFixed(1)} A
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${statusColor}22`,
                  color: statusColor,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {well.turbineStatus === 'normal' ? '正常' :
                   well.turbineStatus === 'unstable' ? '不稳定' : '停止'}
                </div>
              </div>

              {/* Current chart */}
              <CurrentChart data={data} height={160} />
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default TurbineCurrentGrid;
