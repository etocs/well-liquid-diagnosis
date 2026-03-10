import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MonitorDataPoint } from '../../types';

interface Props {
  data: MonitorDataPoint[];
  height?: number;
}

const CurrentChart: React.FC<Props> = ({ data, height = 220 }) => {
  // Use actual system time from data (HH:mm:ss format)
  const times = data.map(d => d.time);
  const currents = data.map(d => d.current);
  const normalCurrents = data.map(d => d.normalCurrent);

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 50, right: 20, bottom: 80, left: 50 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#002244',
      borderColor: '#1d3a5c',
      textStyle: { color: '#fff' },
      formatter: (params: any[]) => {
        const time = params[0]?.axisValue;
        let str = `<div style="padding:4px 8px"><strong>${time}</strong>`;
        params.forEach((p: any) => {
          str += `<br/><span style="color:${p.color}">● ${p.seriesName}: ${p.value} A</span>`;
        });
        return str + '</div>';
      },
    },
    legend: {
      data: ['实际电流', '正常工作电流'],
      textStyle: { color: '#8c9eb5', fontSize: 12 },
      top: 4,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: { zoom: '区域缩放', back: '还原缩放' },
        },
        restore: { title: '还原' },
        saveAsImage: { title: '保存为图片' },
      },
      right: 10,
      top: 25,
      iconStyle: {
        borderColor: '#8c9eb5',
      },
    },
    xAxis: {
      type: 'category',
      name: '时间',
      data: times,
      nameTextStyle: { color: '#8c9eb5', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1d3a5c' } },
      axisLabel: { 
        color: '#8c9eb5', 
        fontSize: 11,
        interval: Math.floor(times.length / 6), // Show ~6 labels
      },
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
        name: '正常工作电流',
        type: 'line',
        data: normalCurrents,
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2, type: 'dashed' },
        itemStyle: { color: '#1890ff' },
        symbol: 'none',
      },
    ],
    dataZoom: [
      { 
        type: 'inside', 
        start: 0, 
        end: 100,
        xAxisIndex: 0,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100,
        height: 20,
        bottom: 10,
        borderColor: '#1d3a5c',
        fillerColor: 'rgba(24,144,255,0.2)',
        handleStyle: {
          color: '#1890ff',
        },
        textStyle: {
          color: '#8c9eb5',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
};

export default CurrentChart;
