import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { Well } from '../../types';

interface Props {
  wells: Well[];
  wellPositions: Record<string, { x: number; y: number; area: string }>;
}

const AreaFaultDistributionChart: React.FC<Props> = ({ wells, wellPositions }) => {
  // Calculate faults by area
  const areaData = ['A', 'B', 'C', 'D', 'E', 'F'].map(area => {
    const areaWells = wells.filter(w => wellPositions[w.id]?.area === area);
    const faultCount = areaWells.filter(w => w.status !== 'normal').length;
    return {
      name: `${area}区`,
      value: faultCount
    };
  }).filter(item => item.value > 0); // Only show areas with faults

  const areaColors = [
    'rgba(100, 150, 255, 0.9)',
    'rgba(100, 200, 150, 0.9)',
    'rgba(255, 200, 100, 0.9)',
    'rgba(150, 100, 255, 0.9)',
    'rgba(255, 150, 150, 0.9)',
    'rgba(100, 255, 200, 0.9)'
  ];

  const totalFaults = areaData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: totalFaults > 0 ? `总故障: ${totalFaults}` : '无故障',
      left: 'center',
      top: '5%',
      textStyle: {
        color: '#00ffff',
        fontSize: 14,
        fontWeight: 700
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 20, 40, 0.95)',
      borderColor: 'rgba(0, 200, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        return `${params.name}<br/>故障数: ${params.value} (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#8c9eb5',
        fontSize: 12
      },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      formatter: (name: string) => {
        const item = areaData.find(d => d.name === name);
        return `${name}: ${item?.value || 0}`;
      }
    },
    series: [
      {
        name: '区域故障',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(0, 20, 40, 0.8)',
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 16
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 700,
            color: '#00ffff'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 255, 255, 0.5)'
          },
          scale: true,
          scaleSize: 10
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.5)',
            width: 1
          }
        },
        data: areaData.length > 0 ? areaData : [
          { name: '系统正常', value: 1, itemStyle: { color: 'rgba(82, 196, 26, 0.3)' } }
        ],
        color: areaColors,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: number) => idx * 100
      },
      // Inner decoration circle
      {
        name: '内圈装饰',
        type: 'pie',
        radius: ['0%', '40%'],
        center: ['40%', '55%'],
        silent: true,
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: 'rgba(0, 100, 200, 0.15)' },
              { offset: 0.8, color: 'rgba(0, 100, 200, 0.05)' },
              { offset: 1, color: 'rgba(0, 100, 200, 0)' }
            ]
          }
        },
        label: {
          show: false
        },
        data: [{ value: 1, name: '' }]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />;
};

export default AreaFaultDistributionChart;
