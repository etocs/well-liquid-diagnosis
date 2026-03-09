import type { MonitorDataPoint, ResistanceSensor, DiagnosisResult, WellStatus } from '../types';
import { CURRENT_THRESHOLDS, RESISTANCE_THRESHOLD } from './constants';

/**
 * 电流诊断法 — 判断涡轮机工作状态
 * - 电流突降超过30% → 涡轮机疑似异常（积液影响）
 * - 电流波动幅度超过正常范围20% → 涡轮机运行不稳定（含气预警）
 * - 电流持续低于额定值50% → 涡轮机严重异常（积液严重）
 */
export function diagnoseByCurrent(data: MonitorDataPoint[]): {
  status: WellStatus;
  diagnosis: string;
  liquidHeight: number;
} {
  if (!data || data.length < 2) {
    return { status: 'normal', diagnosis: '数据不足，无法诊断', liquidHeight: 0 };
  }

  const recentData = data.slice(-20); // 取最近20个数据点
  const currents = recentData.map(d => d.current);
  const avgCurrent = currents.reduce((a, b) => a + b, 0) / currents.length;
  const maxCurrent = Math.max(...currents);
  const minCurrent = Math.min(...currents);
  const rated = CURRENT_THRESHOLDS.ratedCurrent;

  // 检查严重积液：电流持续低于额定值50%
  if (avgCurrent < rated * (1 - CURRENT_THRESHOLDS.severeDropPct)) {
    const estimatedHeight = Math.round((1 - avgCurrent / rated) * 2000);
    return {
      status: 'fault',
      diagnosis: `涡轮机电流持续偏低（均值${avgCurrent.toFixed(1)}A，额定${rated}A），判断为严重积液，涡轮机工作异常`,
      liquidHeight: Math.min(estimatedHeight, 2000),
    };
  }

  // 检查电流突降（比较相邻数据点）
  let maxDrop = 0;
  for (let i = 1; i < currents.length; i++) {
    const drop = (currents[i - 1] - currents[i]) / currents[i - 1];
    if (drop > maxDrop) maxDrop = drop;
  }
  if (maxDrop > CURRENT_THRESHOLDS.dropWarningPct) {
    const estimatedHeight = Math.round(maxDrop * 1500);
    return {
      status: 'warning',
      diagnosis: `涡轮机电流突降${Math.round(maxDrop * 100)}%，疑似井下积液导致涡轮机负载波动`,
      liquidHeight: Math.min(estimatedHeight, 2000),
    };
  }

  // 检查电流波动（含气预警）
  const fluctuation = (maxCurrent - minCurrent) / rated;
  if (fluctuation > CURRENT_THRESHOLDS.fluctuationPct) {
    return {
      status: 'warning',
      diagnosis: `涡轮机电流波动幅度${Math.round(fluctuation * 100)}%超过正常范围，疑似含气导致涡轮机运行不稳定`,
      liquidHeight: Math.round(fluctuation * 500),
    };
  }

  return {
    status: 'normal',
    diagnosis: '涡轮机电流正常，运行稳定，未发现积液异常',
    liquidHeight: 0,
  };
}

/**
 * 水敏电阻网诊断法 — 依据电阻变化判定积液高度
 * 水敏电阻覆盖在整个井管壁上，有液时电阻值显著降低（< 1kΩ）
 */
export function diagnoseByResistance(sensors: ResistanceSensor[]): {
  status: WellStatus;
  diagnosis: string;
  liquidHeight: number;
} {
  if (!sensors || sensors.length === 0) {
    return { status: 'normal', diagnosis: '无传感器数据', liquidHeight: 0 };
  }

  const wetSensors = sensors.filter(s => s.resistance < RESISTANCE_THRESHOLD);

  if (wetSensors.length === 0) {
    return { status: 'normal', diagnosis: '井管壁水敏电阻值正常（均 >1kΩ），井管内无积液', liquidHeight: 0 };
  }

  // 找到最高积液位置（深度最浅的湿传感器）— 不变更原数组
  const sortedWet = [...wetSensors].sort((a, b) => a.depth - b.depth);
  const topLiquidDepth = sortedWet[0].depth;
  const bottomLiquidDepth = sortedWet[sortedWet.length - 1].depth;
  const liquidHeight = bottomLiquidDepth - topLiquidDepth + 100; // 估算高度

  if (wetSensors.length >= 3) {
    return {
      status: 'fault',
      diagnosis: `${wetSensors.length}个水敏传感器电阻低于1kΩ，积液深度${topLiquidDepth}m–${bottomLiquidDepth}m，建议立即排液`,
      liquidHeight,
    };
  }

  return {
    status: 'warning',
    diagnosis: `${wetSensors.length}个水敏传感器检测到电阻偏低，疑似积液深度约${topLiquidDepth}m`,
    liquidHeight: Math.max(100, liquidHeight),
  };
}

/**
 * 综合诊断 — 涡轮机电流状态（40%权重）+ 水敏电阻积液判定（60%权重）
 */
export function comprehensiveDiagnosis(
  wellId: string,
  monitorData: MonitorDataPoint[],
  sensors: ResistanceSensor[]
): DiagnosisResult {
  const currentResult = diagnoseByCurrent(monitorData);
  const resistanceResult = diagnoseByResistance(sensors);

  // 取最严重的状态
  const statusPriority: Record<WellStatus, number> = { fault: 2, warning: 1, normal: 0 };
  const finalStatus: WellStatus =
    statusPriority[currentResult.status] >= statusPriority[resistanceResult.status]
      ? currentResult.status
      : resistanceResult.status;

  // 取两种方法的平均积液高度（加权）
  const liquidHeight = Math.round(
    (currentResult.liquidHeight * 0.4 + resistanceResult.liquidHeight * 0.6)
  );

  // 置信度（有更多传感器数据时置信度更高）
  const confidence = sensors.length > 0 ? 85 : 60;

  return {
    wellId,
    status: finalStatus,
    currentDiagnosis: currentResult.diagnosis,
    resistanceDiagnosis: resistanceResult.diagnosis,
    liquidHeight,
    confidence,
  };
}
