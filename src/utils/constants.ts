// 区域列表
export const ZONES = ['A区', 'B区', 'C区'];

// 故障类型
export const FAULT_TYPES = ['含气', '高温', '过载', '欠载', '绝缘降低', '积液'];

// 故障等级标签
export const FAULT_LEVEL_LABELS: Record<string, string> = {
  level1: '一级（严重）',
  level2: '二级（一般）',
  level3: '三级（轻微）',
};

// 故障等级颜色
export const FAULT_LEVEL_COLORS: Record<string, string> = {
  level1: '#ff4d4f',
  level2: '#faad14',
  level3: '#1890ff',
};

// 状态标签
export const STATUS_LABELS: Record<string, string> = {
  normal: '正常',
  warning: '预警',
  fault: '故障',
};

// 状态颜色
export const STATUS_COLORS: Record<string, string> = {
  normal: '#52c41a',
  warning: '#faad14',
  fault: '#ff4d4f',
};

// 处理结果标签
export const PROCESS_RESULT_LABELS: Record<string, string> = {
  processed: '已处理',
  unprocessed: '未处理',
};

// 处理结果常量
export const PROCESS_RESULT = {
  PROCESSED: 'processed' as const,
  UNPROCESSED: 'unprocessed' as const,
};

// 电流诊断阈值
export const CURRENT_THRESHOLDS = {
  normalMin: 15,       // 正常最低电流 A
  normalMax: 21,       // 正常最高电流 A
  ratedCurrent: 19,    // 额定电流 A
  dropWarningPct: 0.3, // 电流突降预警比例
  fluctuationPct: 0.2, // 波动预警比例
  severeDropPct: 0.5,  // 严重积液阈值
};

// 水敏电阻阈值
export const RESISTANCE_THRESHOLD = 1000; // Ω，低于此值认为有液

// 每页条数选项
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

// 图表线条颜色
export const CHART_COLORS = {
  current: '#ff4d4f',
  predictCurrent: '#1890ff',
  voltage: '#00ffff',
  frequency: '#52c41a',
  intakePressure: '#faad14',
  intakeTemp: '#00ffff',
  motorTemp: '#ff7a45',
};

// 主题颜色
export const THEME = {
  primaryBg: '#001529',
  cardBg: '#002244',
  tableHeaderBg: '#003366',
  tableRowHover: '#004488',
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  text: '#ffffff',
  textSecondary: '#8c9eb5',
  cyan: '#00ffff',
  border: '#1d3a5c',
};
