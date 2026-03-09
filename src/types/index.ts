// 井筒状态
export type WellStatus = 'normal' | 'warning' | 'fault';

// 故障等级
export type FaultLevel = 'level1' | 'level2' | 'level3';

// 处理结果
export type ProcessResult = 'processed' | 'unprocessed';

// 井筒信息
export interface Well {
  id: string;
  name: string;
  platform: string;
  pumpName: string;
  status: WellStatus;
  liquidHeight: number; // 积液高度 m
}

// 故障预警记录
export interface AlarmRecord {
  id: string;
  wellId: string;
  wellName: string;
  platform: string;
  pumpName: string;
  faultType: string;
  faultLevel: FaultLevel;
  faultTime: string;
  faultReason: string;
  processResult: ProcessResult;
  processTime?: string;
  faultRange?: string;
}

// 实时监测数据点
export interface MonitorDataPoint {
  time: string;
  current: number;       // 电流 A
  predictCurrent: number; // 预测电流 A
  voltage: number;       // 电压 V
  frequency: number;     // 电机频率 Hz
  intakePressure: number;  // 吸入口压力 MPa
  intakeTemp: number;    // 吸入口温度 °C
  motorTemp: number;     // 电机绕组温度 °C
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
  liquidHeight: number; // 判定积液高度 m
  updateTime: string;
}

// 诊断结果
export interface DiagnosisResult {
  wellId: string;
  status: WellStatus;
  currentDiagnosis: string;
  resistanceDiagnosis: string;
  liquidHeight: number;
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
  platform?: string;
  wellName?: string;
  startTime?: string;
  endTime?: string;
  pageNum: number;
  pageSize: number;
}
