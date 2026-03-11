// 井筒状态
export type WellStatus = 'normal' | 'warning' | 'fault';

// 故障等级 (积液程度)
export type FaultLevel = 'level1' | 'level2' | 'level3';

// 涡轮机状态
export type TurbineStatus = 'normal' | 'unstable' | 'stopped';

// 处理结果
export type ProcessResult = 'processed' | 'unprocessed';

// 井段信息
export interface WellSegment {
  id: string;
  segmentName: string;      // 井段名称，如 "井段1", "井段2"
  depth: number;            // 深度 m
  currentValue: number;     // 当前电流值 A
  status: WellStatus;       // 井段状态
  liquidHeight: number;     // 该井段积液高度 mm (最大60mm)
}

// 井筒信息
export interface Well {
  id: string;
  name: string;
  zone: string;
  status: WellStatus;
  liquidHeight: number; // 总积液高度 mm (最大60mm)
  turbineStatus: TurbineStatus; // 涡轮机状态
  turbineCurrent: number; // 涡轮机电流 A
  segments: WellSegment[]; // 井段列表
}

// 故障预警记录
export interface AlarmRecord {
  id: string;
  wellId: string;
  wellName: string;
  zone: string;
  faultType: string; // 故障类型：积液一级/二级/三级 或 涡轮机正常/不稳定/停止
  faultLevel?: FaultLevel; // 积液故障的等级
  turbineStatus?: TurbineStatus; // 涡轮机状态故障
  segmentId?: string; // 关联的井段ID（如果是井段故障）
  faultTime: string;
  faultReason: string;
  processResult: ProcessResult;
  processTime?: string;
  faultRange?: string;
}

// 实时监测数据点 (仅电流数据)
export interface MonitorDataPoint {
  time: string;
  current: number;        // 实测电流 A
  normalCurrent: number; // 正常工作电流 A (原predictCurrent)
}

// 水敏电阻传感器数据
export interface ResistanceSensor {
  depth: number;   // 深度 m
  resistance: number; // 电阻值 Ω
  hasLiquid: boolean;
}

// 井筒水敏数据
export interface WellResistanceData {
  wellId: string;
  sensors: ResistanceSensor[];
  liquidHeight: number; // 判定积液高度 mm (最大60mm)
  updateTime: string;
}

// 诊断结果
export interface DiagnosisResult {
  wellId: string;
  status: WellStatus;
  currentDiagnosis: string;
  resistanceDiagnosis: string;
  liquidHeight: number; // mm (最大60mm)
  confidence: number; // 置信度 0-100
}

// 统计数据
export interface Statistics {
  totalWells: number;
  normalWells: number;
  warningWells: number;
  faultWells: number;
  avgLiquidHeight: number;
  totalAlarms: number;
  unprocessedAlarms: number;
}

// 页面查询参数
export interface QueryParams {
  zone?: string;
  wellName?: string;
  startTime?: string;
  endTime?: string;
  pageNum: number;
  pageSize: number;
}
