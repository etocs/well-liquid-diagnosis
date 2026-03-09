import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MonitorDataPoint } from '../../types';

interface Props {
  data: MonitorDataPoint[];
  height?: number;
}

const VoltageFreqChart: React.FC<Props> = ({ data, height = 220 }) => {
  const times = data.map(d => d.time);
  const voltages = data.map(d => d.voltage);
  const freqs = data.map(d => d.frequency);

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
      data: ['电压(V)', '电机频率(Hz)'],
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
        name: '电压(V)',
        nameTextStyle: { color: '#00ffff', fontSize: 11 },
        axisLine: { lineStyle: { color: '#1d3a5c' } },
        axisLabel: { color: '#8c9eb5', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1d3a5c55', type: 'dashed' } },
        min: 0,
        max: 2500,
      },
      {
        type: 'value',
        name: '频率(Hz)',
        nameTextStyle: { color: '#52c41a', fontSize: 11 },
        axisLine: { lineStyle: { color: '#1d3a5c' } },
        axisLabel: { color: '#8c9eb5', fontSize: 11 },
        splitLine: { show: false },
        min: 0,
        max: 60,
      },
    ],
    series: [
      {
        name: '电压(V)',
        type: 'line',
        yAxisIndex: 0,
        data: voltages,
        smooth: true,
        lineStyle: { color: '#00ffff', width: 2 },
        itemStyle: { color: '#00ffff' },
        symbol: 'none',
      },
      {
        name: '电机频率(Hz)',
        type: 'line',
        yAxisIndex: 1,
        data: freqs,
        smooth: true,
        lineStyle: { color: '#52c41a', width: 2 },
        itemStyle: { color: '#52c41a' },
        symbol: 'none',
      },
    ],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
};

export default VoltageFreqChart;
