import type { Well, MonitorDataPoint, ApiConfig, ApiDataPoint, AlarmRecord } from '../types';
import { alarmRecords } from '../mock/data';
import { formatDateTime } from '../utils/date';
import { RESISTANCE_THRESHOLD } from '../utils/constants';
import dayjs from 'dayjs';

/**
 * 根据水敏电阻值估算积液高度 (mm)
 * 水敏电阻值越低 → 液体越多
 *   >= 5000 Ω → 无积液 (0 mm)
 *   1000–5000 Ω → 微量积液 (0–5 mm，三级)
 *   500–1000 Ω → 中等积液 (5–20 mm，二级)
 *   100–500 Ω  → 较多积液 (20–45 mm，一级)
 *   < 100 Ω   → 严重积液 (45–60 mm，一级)
 */
function resistanceToLiquidHeight(resistance: number): number {
  if (resistance >= 5000) return 0;
  if (resistance >= RESISTANCE_THRESHOLD) {
    // 1000–5000 Ω → 0–5 mm
    return (5000 - resistance) / (5000 - RESISTANCE_THRESHOLD) * 5;
  }
  if (resistance >= 500) {
    // 500–1000 Ω → 5–20 mm
    return 5 + (RESISTANCE_THRESHOLD - resistance) / (RESISTANCE_THRESHOLD - 500) * 15;
  }
  if (resistance >= 100) {
    // 100–500 Ω → 20–45 mm
    return 20 + (500 - resistance) / 400 * 25;
  }
  // < 100 Ω → 45–60 mm
  return Math.min(60, 45 + (100 - resistance) / 100 * 15);
}

function liquidHeightToStatus(liquidHeight: number, current: number): 'normal' | 'warning' | 'fault' {
  if (liquidHeight >= 20 || current < 10) return 'fault';
  if (liquidHeight > 0 || current < 16) return 'warning';
  return 'normal';
}

function liquidHeightToTurbineStatus(status: 'normal' | 'warning' | 'fault'): 'normal' | 'unstable' | 'stopped' {
  if (status === 'fault') return 'stopped';
  if (status === 'warning') return 'unstable';
  return 'normal';
}

export const API_WELL_ID = 'API-001';
const API_ZONE = 'API区';

export class ApiDataService {
  private config: ApiConfig | null = null;
  private isConnected: boolean = false;
  private intervalId: number | null = null;
  private currentHistory: MonitorDataPoint[] = [];
  private readonly MAX_HISTORY_POINTS = 60;
  private well: Well | null = null;
  private lastAlarmTime: number = 0;
  private readonly ALARM_INTERVAL_MS = 30_000; // 最多每30秒产生一次告警

  private updateCallbacks: Array<(wells: Well[]) => void> = [];
  private statusCallbacks: Array<(connected: boolean, error?: string) => void> = [];

  /** 设置/更新配置；enabled=true 时自动连接 */
  configure(config: ApiConfig) {
    this.config = config;
    if (config.enabled) {
      this.connect();
    } else {
      this.disconnect();
    }
  }

  getConfig(): ApiConfig | null {
    return this.config;
  }

  /** 开始轮询 */
  connect() {
    this.stopPolling();
    this.startPolling();
  }

  /** 停止轮询，清除数据 */
  disconnect() {
    this.stopPolling();
    this.isConnected = false;
    this.well = null;
    this.currentHistory = [];
    this.notifyUpdates();
    this.notifyStatus(false);
  }

  private startPolling() {
    this.intervalId = window.setInterval(() => {
      this.fetchData();
    }, 1000);
  }

  private stopPolling() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async fetchData() {
    if (!this.config?.url) return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const response = await fetch(this.config.url, { headers });
      if (!response.ok) {
        this.setConnected(false, `HTTP ${response.status}`);
        return;
      }

      const data: ApiDataPoint = await response.json();
      this.processDataPoint(data);
      this.setConnected(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.setConnected(false, msg);
    }
  }

  private setConnected(connected: boolean, error?: string) {
    const changed = this.isConnected !== connected;
    this.isConnected = connected;
    // Always notify on error so the first-connection failure is visible in the UI
    if (changed || (!connected && error)) {
      this.notifyStatus(connected, error);
    }
  }

  private processDataPoint(data: ApiDataPoint) {
    const now = dayjs().format('HH:mm:ss');
    const wellName = (this.config?.wellName && this.config.wellName.trim())
      ? this.config.wellName
      : data.wellName;

    const liquidHeight = Math.round(resistanceToLiquidHeight(data.resistance) * 10) / 10;
    const status = liquidHeightToStatus(liquidHeight, data.current);

    // 追加电流历史
    this.currentHistory.push({
      time: now,
      current: data.current,
      normalCurrent: 19,
    });
    if (this.currentHistory.length > this.MAX_HISTORY_POINTS) {
      this.currentHistory.shift();
    }

    if (!this.well) {
      this.well = this.createWell(wellName, data.current, liquidHeight, status);
    } else {
      this.well.name = wellName;
      this.well.status = status;
      this.well.liquidHeight = liquidHeight;
      this.well.turbineCurrent = data.current;
      this.well.turbineStatus = liquidHeightToTurbineStatus(status);
      this.well.segments.forEach(seg => {
        seg.currentValue = data.current;
        seg.status = status;
        seg.liquidHeight = liquidHeight;
      });
    }

    // 产生告警（限频）
    const now_ms = Date.now();
    if (liquidHeight >= 5 && now_ms - this.lastAlarmTime > this.ALARM_INTERVAL_MS) {
      this.lastAlarmTime = now_ms;
      const level = liquidHeight >= 20 ? 'level1' : 'level2';
      this.generateAlarm(this.well, level, liquidHeight, data.current);
    }

    this.notifyUpdates();
  }

  private createWell(
    wellName: string,
    current: number,
    liquidHeight: number,
    status: 'normal' | 'warning' | 'fault',
  ): Well {
    return {
      id: API_WELL_ID,
      name: wellName,
      zone: API_ZONE,
      status,
      liquidHeight,
      turbineStatus: liquidHeightToTurbineStatus(status),
      turbineCurrent: current,
      segments: [
        {
          id: `${API_WELL_ID}-S1`,
          segmentName: '井段1',
          depth: 500,
          currentValue: current,
          status,
          liquidHeight,
        },
      ],
    };
  }

  private generateAlarm(
    well: Well,
    level: 'level1' | 'level2' | 'level3',
    liquidHeight: number,
    current: number,
  ) {
    const levelNames: Record<string, string> = {
      level1: '积液一级',
      level2: '积液二级',
      level3: '积液三级',
    };
    const alarm: AlarmRecord = {
      id: `API-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      wellId: well.id,
      wellName: well.name,
      zone: well.zone,
      faultType: levelNames[level],
      faultLevel: level as 'level1' | 'level2' | 'level3',
      faultTime: formatDateTime(),
      processResult: 'unprocessed',
      faultReason: `API接入井[${well.name}]检测到${levelNames[level]}，积液高度约${liquidHeight.toFixed(1)}mm，当前电流${current.toFixed(1)}A`,
      faultRange: formatDateTime(),
    };
    alarmRecords.unshift(alarm);
  }

  // -------- Public accessors --------

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getWell(): Well | null {
    return this.well;
  }

  getCurrentHistory(): MonitorDataPoint[] {
    return [...this.currentHistory];
  }

  /** 订阅井数据变化，返回取消订阅函数 */
  onUpdate(callback: (wells: Well[]) => void): () => void {
    this.updateCallbacks.push(callback);
    callback(this.well ? [this.well] : []);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /** 订阅连接状态变化，返回取消订阅函数 */
  onStatusChange(callback: (connected: boolean, error?: string) => void): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyUpdates() {
    const wells = this.well ? [this.well] : [];
    this.updateCallbacks.forEach(cb => cb(wells));
  }

  private notifyStatus(connected: boolean, error?: string) {
    this.statusCallbacks.forEach(cb => cb(connected, error));
  }
}

// -------- Singleton --------
let instance: ApiDataService | null = null;

export function getApiDataService(): ApiDataService {
  if (!instance) {
    instance = new ApiDataService();
    // Restore config from localStorage if present
    try {
      const saved = localStorage.getItem('apiDataConfig');
      if (saved) {
        const config: ApiConfig = JSON.parse(saved);
        if (config.enabled && config.url) {
          instance.configure(config);
        } else {
          // store config but don't connect
          instance.configure({ ...config, enabled: false });
        }
      }
    } catch (_) {
      // ignore
    }
  }
  return instance;
}
