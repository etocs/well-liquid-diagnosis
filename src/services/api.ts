import type { Well, AlarmRecord, MonitorDataPoint, WellResistanceData, Statistics, QueryParams } from '../types';
import { wells, alarmRecords, monitorDataMap, resistanceDataMap } from '../mock/data';
import { PROCESS_RESULT } from '../utils/constants';
import { formatDateTime } from '../utils/date';

// 模拟网络延迟
function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 井筒接口 ============
export async function getWells(): Promise<Well[]> {
  await delay();
  return [...wells];
}

export async function getWellById(id: string): Promise<Well | undefined> {
  await delay(100);
  return wells.find(w => w.id === id);
}

// ============ 预警记录接口 ============
export async function getAlarmRecords(params: QueryParams): Promise<{ list: AlarmRecord[]; total: number }> {
  await delay();
  let list = [...alarmRecords];

  if (params.zone) {
    list = list.filter(a => a.zone === params.zone);
  }
  if (params.wellName) {
    list = list.filter(a => a.wellName.includes(params.wellName!));
  }
  if (params.startTime) {
    list = list.filter(a => a.faultTime >= params.startTime!);
  }
  if (params.endTime) {
    list = list.filter(a => a.faultTime <= params.endTime!);
  }

  const total = list.length;
  const start = (params.pageNum - 1) * params.pageSize;
  const paged = list.slice(start, start + params.pageSize);

  return { list: paged, total };
}

// 处理预警记录
export async function processAlarm(alarmId: string): Promise<AlarmRecord> {
  await delay(500);
  const alarm = alarmRecords.find(a => a.id === alarmId);
  if (!alarm) {
    throw new Error('Alarm not found');
  }
  // 更新处理状态
  alarm.processResult = PROCESS_RESULT.PROCESSED;
  alarm.processTime = formatDateTime();
  return { ...alarm };
}

// ============ 监测数据接口 ============
export async function getMonitorData(wellId: string): Promise<MonitorDataPoint[]> {
  await delay(200);
  return monitorDataMap[wellId] || [];
}

// ============ 水敏电阻数据接口 ============
export async function getResistanceData(wellId: string): Promise<WellResistanceData | undefined> {
  await delay(200);
  return resistanceDataMap[wellId];
}

export async function getAllResistanceData(): Promise<WellResistanceData[]> {
  await delay(200);
  return Object.values(resistanceDataMap);
}

// ============ 统计数据接口 ============
export async function getStatistics(): Promise<Statistics> {
  await delay(100);
  const totalWells = wells.length;
  const normalWells = wells.filter(w => w.status === 'normal').length;
  const warningWells = wells.filter(w => w.status === 'warning').length;
  const faultWells = wells.filter(w => w.status === 'fault').length;
  const avgLiquidHeight = Math.round(
    wells.reduce((sum, w) => sum + w.liquidHeight, 0) / totalWells
  );
  const totalAlarms = alarmRecords.length;
  const unprocessedAlarms = alarmRecords.filter(a => a.processResult === 'unprocessed').length;

  return {
    totalWells,
    normalWells,
    warningWells,
    faultWells,
    avgLiquidHeight,
    totalAlarms,
    unprocessedAlarms,
  };
}
