// System settings utilities

export interface SystemSettings {
  alarmInterval: number; // 报警时间间隔（秒）
  alarmVolume: number; // 报警声音大小（0-100）
  pushType: 'none' | 'wechat' | 'dingtalk' | 'feishu' | 'cnpc'; // 推送类型 (cnpc = 中油即时通讯)
  pushEnabled: boolean; // 是否启用推送
  aiDecisionEnabled: boolean; // 是否启用AI辅助决策
}

export const defaultSettings: SystemSettings = {
  alarmInterval: 30,
  alarmVolume: 50,
  pushType: 'none',
  pushEnabled: false,
  aiDecisionEnabled: false,
};

/**
 * Get system settings from localStorage
 */
export function getSystemSettings(): SystemSettings {
  try {
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load system settings:', e);
  }
  return defaultSettings;
}

/**
 * Save system settings to localStorage
 */
export function saveSystemSettings(settings: SystemSettings): void {
  try {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save system settings:', e);
  }
}

/**
 * Check if AI decision system is enabled
 */
export function isAIDecisionEnabled(): boolean {
  const settings = getSystemSettings();
  return settings.aiDecisionEnabled;
}

/**
 * Get alarm volume (0-100)
 */
export function getAlarmVolume(): number {
  const settings = getSystemSettings();
  return settings.alarmVolume;
}

/**
 * Get alarm interval in seconds
 */
export function getAlarmInterval(): number {
  const settings = getSystemSettings();
  return settings.alarmInterval;
}
