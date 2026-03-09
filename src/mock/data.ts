import type { Well, AlarmRecord, MonitorDataPoint, WellResistanceData, ResistanceSensor } from '../types';
import dayjs from 'dayjs';

// 生成时间序列标签
function generateTimeLabels(count: number, intervalMinutes = 5): string[] {
  const labels: string[] = [];
  const now = dayjs();
  for (let i = count - 1; i >= 0; i--) {
    labels.push(now.subtract(i * intervalMinutes, 'minute').format('HH:mm'));
  }
  return labels;
}

// 生成含噪声的数据序列
function generateNoisyData(
  base: number,
  count: number,
  noise: number,
  trend = 0
): number[] {
  const data: number[] = [];
  let current = base;
  for (let i = 0; i < count; i++) {
    current = current + trend + (Math.random() - 0.5) * noise;
    data.push(Math.round(current * 100) / 100);
  }
  return data;
}

// 生成异常数据（含突降）
function generateAnomalyData(base: number, count: number, noise: number): number[] {
  const data = generateNoisyData(base, count, noise);
  // 在60%位置插入突降
  const anomalyIdx = Math.floor(count * 0.6);
  for (let i = anomalyIdx; i < count; i++) {
    data[i] = data[i] * 0.6 + (Math.random() - 0.5) * noise;
  }
  return data;
}

// ============ 井筒数据 ============
export const wells: Well[] = [
  {
    id: 'W001',
    name: 'A区-1号井管',
    zone: 'A区',
    status: 'normal',
    liquidHeight: 0,
    turbineStatus: 'normal',
    turbineCurrent: 18.5,
    segments: [
      { id: 'W001-S1', segmentName: '井段1', depth: 500, currentValue: 18.6, status: 'normal', liquidHeight: 0 },
      { id: 'W001-S2', segmentName: '井段2', depth: 1000, currentValue: 18.4, status: 'normal', liquidHeight: 0 },
      { id: 'W001-S3', segmentName: '井段3', depth: 1500, currentValue: 18.5, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W002',
    name: 'A区-2号井管',
    zone: 'A区',
    status: 'warning',
    liquidHeight: 320,
    turbineStatus: 'unstable',
    turbineCurrent: 17.2,
    segments: [
      { id: 'W002-S1', segmentName: '井段1', depth: 500, currentValue: 17.5, status: 'warning', liquidHeight: 120 },
      { id: 'W002-S2', segmentName: '井段2', depth: 1000, currentValue: 17.0, status: 'warning', liquidHeight: 200 },
      { id: 'W002-S3', segmentName: '井段3', depth: 1500, currentValue: 17.1, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W003',
    name: 'A区-3号井管',
    zone: 'A区',
    status: 'fault',
    liquidHeight: 850,
    turbineStatus: 'stopped',
    turbineCurrent: 8.5,
    segments: [
      { id: 'W003-S1', segmentName: '井段1', depth: 500, currentValue: 9.2, status: 'fault', liquidHeight: 350 },
      { id: 'W003-S2', segmentName: '井段2', depth: 1000, currentValue: 8.5, status: 'fault', liquidHeight: 500 },
      { id: 'W003-S3', segmentName: '井段3', depth: 1500, currentValue: 8.0, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W004',
    name: 'B区-1号井管',
    zone: 'B区',
    status: 'normal',
    liquidHeight: 0,
    turbineStatus: 'normal',
    turbineCurrent: 19.0,
    segments: [
      { id: 'W004-S1', segmentName: '井段1', depth: 500, currentValue: 19.1, status: 'normal', liquidHeight: 0 },
      { id: 'W004-S2', segmentName: '井段2', depth: 1000, currentValue: 18.9, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W005',
    name: 'B区-2号井管',
    zone: 'B区',
    status: 'warning',
    liquidHeight: 150,
    turbineStatus: 'normal',
    turbineCurrent: 18.0,
    segments: [
      { id: 'W005-S1', segmentName: '井段1', depth: 500, currentValue: 17.8, status: 'warning', liquidHeight: 150 },
      { id: 'W005-S2', segmentName: '井段2', depth: 1000, currentValue: 18.2, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W006',
    name: 'C区-1号井管',
    zone: 'C区',
    status: 'normal',
    liquidHeight: 0,
    turbineStatus: 'normal',
    turbineCurrent: 18.8,
    segments: [
      { id: 'W006-S1', segmentName: '井段1', depth: 600, currentValue: 18.7, status: 'normal', liquidHeight: 0 },
      { id: 'W006-S2', segmentName: '井段2', depth: 1200, currentValue: 18.9, status: 'normal', liquidHeight: 0 },
      { id: 'W006-S3', segmentName: '井段3', depth: 1800, currentValue: 18.8, status: 'normal', liquidHeight: 0 },
    ],
  },
  {
    id: 'W007',
    name: 'C区-2号井管',
    zone: 'C区',
    status: 'fault',
    liquidHeight: 1200,
    turbineStatus: 'unstable',
    turbineCurrent: 10.5,
    segments: [
      { id: 'W007-S1', segmentName: '井段1', depth: 600, currentValue: 11.0, status: 'fault', liquidHeight: 400 },
      { id: 'W007-S2', segmentName: '井段2', depth: 1200, currentValue: 10.5, status: 'fault', liquidHeight: 600 },
      { id: 'W007-S3', segmentName: '井段3', depth: 1800, currentValue: 10.0, status: 'fault', liquidHeight: 200 },
    ],
  },
];

// ============ 故障预警数据 ============
export const alarmRecords: AlarmRecord[] = [
  {
    id: 'A001',
    wellId: 'W003',
    wellName: 'A区-3号井管',
    zone: 'A区',
    faultType: '积液一级',
    faultLevel: 'level1',
    segmentId: 'W003-S1',
    faultTime: '2026-03-09 06:30:00',
    processResult: 'unprocessed',
    faultReason: '井段1电流持续低于额定值50%，水敏传感器检测到严重积液，积液高度约350m',
    faultRange: '2026-03-09 06:00:00 ~ 2026-03-09 06:30:00',
  },
  {
    id: 'A002',
    wellId: 'W003',
    wellName: 'A区-3号井管',
    zone: 'A区',
    faultType: '涡轮机停止',
    turbineStatus: 'stopped',
    faultTime: '2026-03-09 06:30:00',
    processResult: 'unprocessed',
    faultReason: '涡轮机电流严重偏低（8.5A），设备已停止运行，需立即检修',
    faultRange: '2026-03-09 06:15:00 ~ 2026-03-09 06:30:00',
  },
  {
    id: 'A003',
    wellId: 'W002',
    wellName: 'A区-2号井管',
    zone: 'A区',
    faultType: '积液二级',
    faultLevel: 'level2',
    segmentId: 'W002-S1',
    faultTime: '2026-03-09 05:15:00',
    processResult: 'unprocessed',
    faultReason: '井段1电流异常，检测到积液高度约120m，建议及时处理',
    faultRange: '2026-03-09 04:45:00 ~ 2026-03-09 05:15:00',
  },
  {
    id: 'A004',
    wellId: 'W002',
    wellName: 'A区-2号井管',
    zone: 'A区',
    faultType: '涡轮机不稳定',
    turbineStatus: 'unstable',
    faultTime: '2026-03-09 05:00:00',
    processResult: 'unprocessed',
    faultReason: '涡轮机电流波动幅度超过正常范围20%，运行不稳定',
    faultRange: '2026-03-09 04:30:00 ~ 2026-03-09 05:00:00',
  },
  {
    id: 'A005',
    wellId: 'W007',
    wellName: 'C区-2号井管',
    zone: 'C区',
    faultType: '积液一级',
    faultLevel: 'level1',
    segmentId: 'W007-S2',
    faultTime: '2026-03-08 22:10:00',
    processResult: 'unprocessed',
    faultReason: '井段2水敏电阻网检测到大范围积液，积液高度约600m，建议立即处理',
    faultRange: '2026-03-08 21:30:00 ~ 2026-03-08 22:10:00',
  },
  {
    id: 'A006',
    wellId: 'W005',
    wellName: 'B区-2号井管',
    zone: 'B区',
    faultType: '积液三级',
    faultLevel: 'level3',
    segmentId: 'W005-S1',
    faultTime: '2026-03-08 18:00:00',
    processResult: 'processed',
    processTime: '2026-03-08 19:30:00',
    faultReason: '井段1检测到轻微积液，积液高度约150m，已进行排液处理',
    faultRange: '2026-03-08 17:30:00 ~ 2026-03-08 18:00:00',
  },
  {
    id: 'A007',
    wellId: 'W001',
    wellName: 'A区-1号井管',
    zone: 'A区',
    faultType: '涡轮机正常',
    turbineStatus: 'normal',
    faultTime: '2026-03-08 15:00:00',
    processResult: 'processed',
    processTime: '2026-03-08 15:30:00',
    faultReason: '涡轮机状态检查，运行正常，无异常',
    faultRange: '2026-03-08 14:30:00 ~ 2026-03-08 15:00:00',
  },
];

// ============ 监测数据 (仅电流) ============
const DATA_COUNT = 60;
const timeLabels = generateTimeLabels(DATA_COUNT);

function buildMonitorData(
  currentData: number[],
  predictCurrentData: number[],
): MonitorDataPoint[] {
  return timeLabels.map((time, i) => ({
    time,
    current: currentData[i],
    predictCurrent: predictCurrentData[i],
  }));
}

// 额定电流基准（各井统一 19A）
const RATED = 19;

// W001 正常工况
export const monitorDataW001: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(18.5, DATA_COUNT, 0.4),
  Array(DATA_COUNT).fill(RATED)
);

// W002 含气预警（电流波动大）
export const monitorDataW002: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(17.5, DATA_COUNT, 2.5),
  Array(DATA_COUNT).fill(RATED)
);

// W003 严重积液（电流突降）
export const monitorDataW003: MonitorDataPoint[] = buildMonitorData(
  generateAnomalyData(18.0, DATA_COUNT, 0.5),
  Array(DATA_COUNT).fill(RATED)
);

// W004 正常工况
export const monitorDataW004: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(19.0, DATA_COUNT, 0.3),
  Array(DATA_COUNT).fill(RATED)
);

// W005 欠载预警
export const monitorDataW005: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(14.5, DATA_COUNT, 0.8),
  Array(DATA_COUNT).fill(RATED)
);

// W006 正常工况
export const monitorDataW006: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(18.2, DATA_COUNT, 0.35),
  Array(DATA_COUNT).fill(RATED)
);

// W007 严重积液
export const monitorDataW007: MonitorDataPoint[] = buildMonitorData(
  generateAnomalyData(17.5, DATA_COUNT, 0.6),
  Array(DATA_COUNT).fill(RATED)
);

export const monitorDataMap: Record<string, MonitorDataPoint[]> = {
  W001: monitorDataW001,
  W002: monitorDataW002,
  W003: monitorDataW003,
  W004: monitorDataW004,
  W005: monitorDataW005,
  W006: monitorDataW006,
  W007: monitorDataW007,
};

// ============ 水敏电阻网数据 ============
function generateResistanceSensors(depths: number[], liquidTopDepth: number): ResistanceSensor[] {
  return depths.map(depth => {
    const hasLiquid = depth >= liquidTopDepth;
    const resistance = hasLiquid
      ? Math.round(Math.random() * 500 + 100)   // 有液：100-600Ω
      : Math.round(Math.random() * 5000 + 2000); // 无液：2000-7000Ω
    return { depth, resistance, hasLiquid };
  });
}

const sensorDepths = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];

export const resistanceDataMap: Record<string, WellResistanceData> = {
  W001: {
    wellId: 'W001',
    sensors: generateResistanceSensors(sensorDepths, 9999), // 无积液
    liquidHeight: 0,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W002: {
    wellId: 'W002',
    sensors: generateResistanceSensors(sensorDepths, 1600), // 积液从1600m开始
    liquidHeight: 320,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W003: {
    wellId: 'W003',
    sensors: generateResistanceSensors(sensorDepths, 1200), // 积液从1200m开始
    liquidHeight: 850,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W004: {
    wellId: 'W004',
    sensors: generateResistanceSensors(sensorDepths, 9999), // 无积液
    liquidHeight: 0,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W005: {
    wellId: 'W005',
    sensors: generateResistanceSensors(sensorDepths, 1800), // 积液从1800m开始
    liquidHeight: 150,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W006: {
    wellId: 'W006',
    sensors: generateResistanceSensors(sensorDepths, 9999), // 无积液
    liquidHeight: 0,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  W007: {
    wellId: 'W007',
    sensors: generateResistanceSensors(sensorDepths, 800), // 积液从800m开始
    liquidHeight: 1200,
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
};
