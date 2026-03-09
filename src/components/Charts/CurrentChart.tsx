import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MonitorDataPoint } from '../../types';

interface Props {
  data: MonitorDataPoint[];
  height?: number;
}

const CurrentChart: React.FC<Props> = ({ data, height = 220 }) => {
  const times = data.map(d => d.time);
  const currents = data.map(d => d.current);
  const predictCurrents = data.map(d => d.predictCurrent);

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 20, bottom: 30, left: 50 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#002244',
      borderColor: '#1d3a5c',
      textStyle: { color: '#fff' },
      formatter: (params: any[]) => {
        let str = `<div style="padding:4px 8px"><strong>${params[0]?.axisValue}</strong>`;
        params.forEach((p: any) => {
          str += `<br/><span style="color:${p.color}">● ${p.seriesName}: ${p.value} A</span>`;
        });
        return str + '</div>';
      },
    },
    legend: {
      data: ['实际电流', '预测电流'],
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
    yAxis: {
      type: 'value',
      name: '电流(A)',
      nameTextStyle: { color: '#8c9eb5', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1d3a5c' } },
      axisLabel: { color: '#8c9eb5', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1d3a5c55', type: 'dashed' } },
      min: 0,
      max: 25,
    },
    series: [
      {
        name: '实际电流',
        type: 'line',
        data: currents,
        smooth: true,
        lineStyle: { color: '#ff4d4f', width: 2 },
        itemStyle: { color: '#ff4d4f' },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#ff4d4f33' },
              { offset: 1, color: '#ff4d4f05' },
            ],
          },
        },
      },
      {
        name: '预测电流',
        type: 'line',
        data: predictCurrents,
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2, type: 'dashed' },
        itemStyle: { color: '#1890ff' },
        symbol: 'none',
      },
    ],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
};

export default CurrentChart;
