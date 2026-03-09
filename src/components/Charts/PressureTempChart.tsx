import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MonitorDataPoint } from '../../types';

interface Props {
  data: MonitorDataPoint[];
  height?: number;
}

const PressureTempChart: React.FC<Props> = ({ data, height = 220 }) => {
  const times = data.map(d => d.time);
  const pressures = data.map(d => d.intakePressure);
  const intakeTemps = data.map(d => d.intakeTemp);
  const motorTemps = data.map(d => d.motorTemp);

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 60, bottom: 30, left: 60 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#002244',
      borderColor: '#1d3a5c',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: ['吸入口压力(MPa)', '吸入口温度(°C)', '绕组温度(°C)'],
      textStyle: { color: '#8c9eb5', fontSize: 12 },
      top: 4,
      right: 10,
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { lineStyle: { color: '#1d3a5c' } },
      axisLabel: { color: '#8c9eb5', fontSize: 11, interval: Math.floor(times.length / 6) },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '压力(MPa)',
        nameTextStyle: { color: '#faad14', fontSize: 11 },
        axisLine: { lineStyle: { color: '#1d3a5c' } },
        axisLabel: { color: '#8c9eb5', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1d3a5c55', type: 'dashed' } },
        min: 0,
        max: 15,
      },
      {
        type: 'value',
        name: '温度(°C)',
        nameTextStyle: { color: '#00ffff', fontSize: 11 },
        axisLine: { lineStyle: { color: '#1d3a5c' } },
        axisLabel: { color: '#8c9eb5', fontSize: 11 },
        splitLine: { show: false },
        min: 0,
        max: 150,
      },
    ],
    series: [
      {
        name: '吸入口压力(MPa)',
        type: 'line',
        yAxisIndex: 0,
        data: pressures,
        smooth: true,
        lineStyle: { color: '#faad14', width: 2 },
        itemStyle: { color: '#faad14' },
        symbol: 'none',
      },
      {
        name: '吸入口温度(°C)',
        type: 'line',
        yAxisIndex: 1,
        data: intakeTemps,
        smooth: true,
        lineStyle: { color: '#00ffff', width: 2 },
        itemStyle: { color: '#00ffff' },
        symbol: 'none',
      },
      {
        name: '绕组温度(°C)',
        type: 'line',
        yAxisIndex: 1,
        data: motorTemps,
        smooth: true,
        lineStyle: { color: '#ff7a45', width: 2 },
        itemStyle: { color: '#ff7a45' },
        symbol: 'none',
      },
    ],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
};

export default PressureTempChart;
