import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { ResistanceSensor } from '../../types';

interface Props {
  sensors: ResistanceSensor[];
  liquidHeight: number;
  height?: number;
}

const LiquidLevelChart: React.FC<Props> = ({ sensors, liquidHeight, height = 400 }) => {
  // 横向条形图展示各深度传感器状态
  const depths = sensors.map(s => `${s.depth}m`).reverse();
  const resistances = sensors.map(s => s.resistance).reverse();
  const colors = sensors.map(s => s.hasLiquid ? '#1890ff' : '#52c41a').reverse();

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 20, right: 80, bottom: 20, left: 70 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#002244',
      borderColor: '#1d3a5c',
      textStyle: { color: '#fff' },
      formatter: (params: any[]) => {
        const p = params[0];
        const sensor = sensors.find(s => `${s.depth}m` === p.name);
        const status = sensor?.hasLiquid ? '有液' : '无液';
        return `深度: ${p.name}<br/>电阻: ${p.value} Ω<br/>状态: <span style="color:${sensor?.hasLiquid ? '#1890ff' : '#52c41a'}">${status}</span>`;
      },
    },
    xAxis: {
      type: 'value',
      name: '电阻值(Ω)',
      nameTextStyle: { color: '#8c9eb5', fontSize: 11 },
      axisLabel: { color: '#8c9eb5', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1d3a5c' } },
      splitLine: { lineStyle: { color: '#1d3a5c55', type: 'dashed' } },
      max: 8000,
    },
    yAxis: {
      type: 'category',
      data: depths,
      axisLabel: { color: '#8c9eb5', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1d3a5c' } },
      splitLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: resistances.map((val, i) => ({
          value: val,
          itemStyle: { color: colors[i] },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: '#8c9eb5',
          fontSize: 11,
          formatter: (params: any) => {
            const sensor = sensors.slice().reverse()[params.dataIndex];
            return sensor?.hasLiquid ? '💧有液' : '✓无液';
          },
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#ff4d4f', type: 'dashed', width: 2 },
          label: { show: true, formatter: '积液阈值 1000Ω', color: '#ff4d4f' },
          data: [{ xAxis: 1000 }],
        },
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'right',
        top: 10,
        style: {
          text: `积液高度: ${liquidHeight.toFixed(1)}mm`,
          fontSize: 14,
          fill: liquidHeight > 0 ? '#ff4d4f' : '#52c41a',
          fontWeight: 'bold',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
};

export default LiquidLevelChart;
