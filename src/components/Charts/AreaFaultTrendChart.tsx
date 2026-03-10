import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { Well } from '../../types';

interface Props {
  wells: Well[];
  wellPositions: Record<string, { x: number; y: number; area: string }>;
}

interface AreaFaultData {
  timestamp: string;
  [key: string]: number | string;
}

const AreaFaultTrendChart: React.FC<Props> = ({ wells, wellPositions }) => {
  const [trendData, setTrendData] = useState<AreaFaultData[]>([]);

  useEffect(() => {
    // Calculate faults by area
    const areaFaults: Record<string, number> = {};
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(area => {
      const areaWells = wells.filter(w => wellPositions[w.id]?.area === area);
      areaFaults[area] = areaWells.filter(w => w.status !== 'normal').length;
    });

    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    setTrendData(prev => {
      const newData = [
        ...prev,
        {
          timestamp,
          ...areaFaults
        }
      ];
      // Keep last 20 data points (1 minute of data at 3s intervals)
      return newData.slice(-20);
    });
  }, [wells, wellPositions]);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 20, 40, 0.95)',
      borderColor: 'rgba(0, 200, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 100, 200, 0.8)'
        }
      }
    },
    legend: {
      data: ['A区', 'B区', 'C区', 'D区', 'E区', 'F区'],
      textStyle: {
        color: '#8c9eb5',
        fontSize: 12
      },
      top: 10,
      right: 20,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 10
    },
    grid: {
      left: '8%',
      right: '4%',
      bottom: '15%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.map(d => d.timestamp),
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#8c9eb5',
        fontSize: 10,
        rotate: 30
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '故障数',
      nameTextStyle: {
        color: '#00ffff',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.3)'
        }
      },
      axisLabel: {
        color: '#8c9eb5',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 200, 255, 0.1)',
          type: 'dashed'
        }
      },
      minInterval: 1
    },
    series: [
      {
        name: 'A区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.A || 0),
        lineStyle: {
          color: 'rgba(100, 150, 255, 1)',
          width: 2,
          shadowColor: 'rgba(100, 150, 255, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(100, 150, 255, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(100, 150, 255, 0.3)' },
              { offset: 1, color: 'rgba(100, 150, 255, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'B区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.B || 0),
        lineStyle: {
          color: 'rgba(100, 200, 150, 1)',
          width: 2,
          shadowColor: 'rgba(100, 200, 150, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(100, 200, 150, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(100, 200, 150, 0.3)' },
              { offset: 1, color: 'rgba(100, 200, 150, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'C区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.C || 0),
        lineStyle: {
          color: 'rgba(255, 200, 100, 1)',
          width: 2,
          shadowColor: 'rgba(255, 200, 100, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(255, 200, 100, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 200, 100, 0.3)' },
              { offset: 1, color: 'rgba(255, 200, 100, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'D区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.D || 0),
        lineStyle: {
          color: 'rgba(150, 100, 255, 1)',
          width: 2,
          shadowColor: 'rgba(150, 100, 255, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(150, 100, 255, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(150, 100, 255, 0.3)' },
              { offset: 1, color: 'rgba(150, 100, 255, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'E区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.E || 0),
        lineStyle: {
          color: 'rgba(255, 150, 150, 1)',
          width: 2,
          shadowColor: 'rgba(255, 150, 150, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(255, 150, 150, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 150, 150, 0.3)' },
              { offset: 1, color: 'rgba(255, 150, 150, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'F区',
        type: 'line',
        smooth: true,
        data: trendData.map(d => d.F || 0),
        lineStyle: {
          color: 'rgba(100, 255, 200, 1)',
          width: 2,
          shadowColor: 'rgba(100, 255, 200, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgba(100, 255, 200, 1)',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(100, 255, 200, 0.3)' },
              { offset: 1, color: 'rgba(100, 255, 200, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default AreaFaultTrendChart;
