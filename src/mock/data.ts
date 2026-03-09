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
  { id: 'W001', name: 'A区-1号井管', zone: 'A区', status: 'normal', liquidHeight: 0 },
  { id: 'W002', name: 'A区-2号井管', zone: 'A区', status: 'warning', liquidHeight: 320 },
  { id: 'W003', name: 'A区-3号井管', zone: 'A区', status: 'fault', liquidHeight: 850 },
  { id: 'W004', name: 'B区-1号井管', zone: 'B区', status: 'normal', liquidHeight: 0 },
  { id: 'W005', name: 'B区-2号井管', zone: 'B区', status: 'warning', liquidHeight: 150 },
  { id: 'W006', name: 'C区-1号井管', zone: 'C区', status: 'normal', liquidHeight: 0 },
  { id: 'W007', name: 'C区-2号井管', zone: 'C区', status: 'fault', liquidHeight: 1200 },
];

// ============ 故障预警数据 ============
export const alarmRecords: AlarmRecord[] = [
  {
    id: 'A001', wellId: 'W003', wellName: 'A区-3号井管', zone: 'A区',
    faultType: '积液', faultLevel: 'level1',
    faultTime: '2026-03-09 06:30:00', processResult: 'unprocessed',
    faultReason: '电流持续低于额定值50%，水敏传感器检测到多点积液，判断为严重积液工况',
    faultRange: '2026-03-09 06:00:00 ~ 2026-03-09 06:30:00',
  },
  {
    id: 'A002', wellId: 'W002', wellName: 'A区-2号井管', zone: 'A区',
    faultType: '含气', faultLevel: 'level2',
    faultTime: '2026-03-09 05:15:00', processResult: 'unprocessed',
    faultReason: '电流波动幅度超过正常范围20%，疑似井管入口含气量较高',
    faultRange: '2026-03-09 04:45:00 ~ 2026-03-09 05:15:00',
  },
  {
    id: 'A003', wellId: 'W005', wellName: 'B区-2号井管', zone: 'B区',
    faultType: '欠载', faultLevel: 'level2',
    faultTime: '2026-03-09 03:20:00', processResult: 'processed', processTime: '2026-03-09 04:00:00',
    faultReason: '负载低于额定值，可能存在少量积液或地层液量减少',
    faultRange: '2026-03-09 03:00:00 ~ 2026-03-09 03:20:00',
  },
  {
    id: 'A004', wellId: 'W007', wellName: 'C区-2号井管', zone: 'C区',
    faultType: '积液', faultLevel: 'level1',
    faultTime: '2026-03-08 22:10:00', processResult: 'unprocessed',
    faultReason: '水敏电阻网检测到大范围积液，积液高度约1200m，建议立即处理',
    faultRange: '2026-03-08 21:30:00 ~ 2026-03-08 22:10:00',
  },
  {
    id: 'A005', wellId: 'W001', wellName: 'A区-1号井管', zone: 'A区',
    faultType: '高温', faultLevel: 'level3',
    faultTime: '2026-03-08 18:45:00', processResult: 'processed', processTime: '2026-03-08 19:30:00',
    faultReason: '井管温度略高于正常值，已检查冷却措施，温度恢复正常',
    faultRange: '2026-03-08 18:30:00 ~ 2026-03-08 18:45:00',
  },
  {
    id: 'A006', wellId: 'W004', wellName: 'B区-1号井管', zone: 'B区',
    faultType: '过载', faultLevel: 'level2',
    faultTime: '2026-03-08 15:00:00', processResult: 'processed', processTime: '2026-03-08 16:00:00',
    faultReason: '电流超过额定值15%，过载运行，已调整变频器频率',
    faultRange: '2026-03-08 14:30:00 ~ 2026-03-08 15:00:00',
  },
  {
    id: 'A007', wellId: 'W006', wellName: 'C区-1号井管', zone: 'C区',
    faultType: '绝缘降低', faultLevel: 'level3',
    faultTime: '2026-03-08 10:20:00', processResult: 'processed', processTime: '2026-03-08 11:00:00',
    faultReason: '电缆绝缘电阻略有下降，已检查接头密封，绝缘恢复正常',
    faultRange: '2026-03-08 10:00:00 ~ 2026-03-08 10:20:00',
  },
  {
    id: 'A008', wellId: 'W002', wellName: 'A区-2号井管', zone: 'A区',
    faultType: '积液', faultLevel: 'level2',
    faultTime: '2026-03-07 20:00:00', processResult: 'processed', processTime: '2026-03-07 21:30:00',
    faultReason: '电流突降32%，诊断为疑似积液，已进行排液作业',
    faultRange: '2026-03-07 19:30:00 ~ 2026-03-07 20:00:00',
  },
];

// ============ 监测数据 ============
const DATA_COUNT = 60;
const timeLabels = generateTimeLabels(DATA_COUNT);

function buildMonitorData(
  currentData: number[],
  predictCurrentData: number[],
  voltageData: number[],
  freqData: number[],
  pressureData: number[],
  intakeTempData: number[],
  motorTempData: number[]
): MonitorDataPoint[] {
  return timeLabels.map((time, i) => ({
    time,
    current: currentData[i],
    predictCurrent: predictCurrentData[i],
    voltage: voltageData[i],
    frequency: freqData[i],
    intakePressure: pressureData[i],
    intakeTemp: intakeTempData[i],
    motorTemp: motorTempData[i],
  }));
}

// W001 正常工况
export const monitorDataW001: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(18.5, DATA_COUNT, 0.4),
  generateNoisyData(18.8, DATA_COUNT, 0.2),
  generateNoisyData(1820, DATA_COUNT, 20),
  generateNoisyData(45, DATA_COUNT, 1),
  generateNoisyData(10.2, DATA_COUNT, 0.3),
  generateNoisyData(98, DATA_COUNT, 2),
  generateNoisyData(102, DATA_COUNT, 2)
);

// W002 含气预警（电流波动大）
export const monitorDataW002: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(17.5, DATA_COUNT, 2.5),
  generateNoisyData(18.5, DATA_COUNT, 0.3),
  generateNoisyData(1780, DATA_COUNT, 50),
  generateNoisyData(44, DATA_COUNT, 2),
  generateNoisyData(9.8, DATA_COUNT, 0.5),
  generateNoisyData(100, DATA_COUNT, 4),
  generateNoisyData(105, DATA_COUNT, 3)
);

// W003 严重积液（电流突降）
export const monitorDataW003: MonitorDataPoint[] = buildMonitorData(
  generateAnomalyData(18.0, DATA_COUNT, 0.5),
  generateNoisyData(18.5, DATA_COUNT, 0.2),
  generateAnomalyData(1800, DATA_COUNT, 30),
  generateAnomalyData(45, DATA_COUNT, 1),
  generateAnomalyData(10.5, DATA_COUNT, 0.3),
  generateNoisyData(110, DATA_COUNT, 3),
  generateNoisyData(108, DATA_COUNT, 3)
);

// W004 正常工况
export const monitorDataW004: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(19.0, DATA_COUNT, 0.3),
  generateNoisyData(19.2, DATA_COUNT, 0.2),
  generateNoisyData(1850, DATA_COUNT, 15),
  generateNoisyData(46, DATA_COUNT, 0.8),
  generateNoisyData(10.8, DATA_COUNT, 0.2),
  generateNoisyData(96, DATA_COUNT, 1.5),
  generateNoisyData(99, DATA_COUNT, 1.5)
);

// W005 欠载预警
export const monitorDataW005: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(14.5, DATA_COUNT, 0.8),
  generateNoisyData(18.5, DATA_COUNT, 0.3),
  generateNoisyData(1750, DATA_COUNT, 30),
  generateNoisyData(43, DATA_COUNT, 1.5),
  generateNoisyData(9.5, DATA_COUNT, 0.4),
  generateNoisyData(95, DATA_COUNT, 3),
  generateNoisyData(98, DATA_COUNT, 3)
);

// W006 正常工况
export const monitorDataW006: MonitorDataPoint[] = buildMonitorData(
  generateNoisyData(18.2, DATA_COUNT, 0.35),
  generateNoisyData(18.5, DATA_COUNT, 0.2),
  generateNoisyData(1810, DATA_COUNT, 18),
  generateNoisyData(45.5, DATA_COUNT, 0.9),
  generateNoisyData(10.3, DATA_COUNT, 0.25),
  generateNoisyData(99, DATA_COUNT, 2),
  generateNoisyData(101, DATA_COUNT, 2)
);

// W007 严重积液
export const monitorDataW007: MonitorDataPoint[] = buildMonitorData(
  generateAnomalyData(17.5, DATA_COUNT, 0.6),
  generateNoisyData(18.8, DATA_COUNT, 0.25),
  generateAnomalyData(1760, DATA_COUNT, 40),
  generateAnomalyData(44, DATA_COUNT, 1.2),
  generateAnomalyData(10.0, DATA_COUNT, 0.35),
  generateNoisyData(115, DATA_COUNT, 4),
  generateNoisyData(112, DATA_COUNT, 4)
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
