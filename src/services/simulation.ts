import type { Well, WellSegment, AlarmRecord, MonitorDataPoint } from '../types';
import { wells as initialWells, alarmRecords } from '../mock/data';
import { formatDateTime } from '../utils/date';
import dayjs from 'dayjs';

export class SimulationService {
  private wells: Well[];
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private updateCallbacks: Array<(wells: Well[]) => void> = [];
  private alarmCallbacks: Array<(alarms: AlarmRecord[]) => void> = [];
  private turbineCurrentHistory: Map<string, MonitorDataPoint[]> = new Map();
  private readonly MAX_HISTORY_POINTS = 60; // Keep last 60 data points

  constructor() {
    this.wells = JSON.parse(JSON.stringify(initialWells)); // Deep clone
    this.initializeTurbineHistory();
  }

  /**
   * Initialize turbine current history for all wells
   */
  private initializeTurbineHistory() {
    this.wells.forEach(well => {
      const history: MonitorDataPoint[] = [];
      const now = dayjs();
      
      // Create initial historical data
      for (let i = this.MAX_HISTORY_POINTS - 1; i >= 0; i--) {
        history.push({
          time: now.subtract(i * 3, 'second').format('HH:mm:ss'),
          current: well.turbineCurrent + (Math.random() - 0.5) * 0.5,
          predictCurrent: 19, // Rated current
        });
      }
      
      this.turbineCurrentHistory.set(well.id, history);
    });
  }

  /**
   * Start the simulation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.updateSimulation();
    }, 3000); // Update every 3 seconds
  }

  /**
   * Stop the simulation
   */
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Reset simulation to initial state
   */
  reset() {
    this.stop();
    this.wells = JSON.parse(JSON.stringify(initialWells));
    this.initializeTurbineHistory();
    this.notifyWellUpdates();
  }

  /**
   * Subscribe to well updates
   */
  onWellUpdate(callback: (wells: Well[]) => void) {
    this.updateCallbacks.push(callback);
    // Immediately call with current state
    callback(this.wells);
  }

  /**
   * Subscribe to alarm updates
   */
  onAlarmUpdate(callback: (alarms: AlarmRecord[]) => void) {
    this.alarmCallbacks.push(callback);
  }

  /**
   * Get current wells state
   */
  getWells(): Well[] {
    return this.wells;
  }

  /**
   * Get turbine current history for a specific well
   */
  getTurbineCurrentHistory(wellId: string): MonitorDataPoint[] {
    return this.turbineCurrentHistory.get(wellId) || [];
  }

  /**
   * Get all turbine current histories
   */
  getAllTurbineCurrentHistories(): Map<string, MonitorDataPoint[]> {
    return this.turbineCurrentHistory;
  }

  /**
   * Main simulation update logic
   */
  private updateSimulation() {
    const currentTime = dayjs().format('HH:mm:ss');
    
    this.wells.forEach(well => {
      // Update turbine current with some randomness
      this.updateTurbineCurrent(well);

      // Add new turbine current data point to history
      const history = this.turbineCurrentHistory.get(well.id) || [];
      history.push({
        time: currentTime,
        current: well.turbineCurrent,
        predictCurrent: 19, // Rated current
      });
      
      // Keep only last MAX_HISTORY_POINTS data points
      if (history.length > this.MAX_HISTORY_POINTS) {
        history.shift();
      }
      this.turbineCurrentHistory.set(well.id, history);

      // Update each segment
      well.segments.forEach(segment => {
        this.updateSegment(segment, well);
      });

      // Recalculate total liquid height
      well.liquidHeight = well.segments.reduce((sum, seg) => sum + seg.liquidHeight, 0);

      // Update well status based on segments and turbine
      this.updateWellStatus(well);

      // Check for new alarms
      this.checkForAlarms(well);
    });

    this.notifyWellUpdates();
  }

  /**
   * Update turbine current value with increased variation
   */
  private updateTurbineCurrent(well: Well) {
    const baseValue = well.turbineCurrent;
    
    // Add random fluctuation with more variation
    const fluctuation = (Math.random() - 0.5) * 1.5; // Increased from 0.5 to 1.5
    let newValue = baseValue + fluctuation;

    // If turbine is stopped, keep it low with more variation
    if (well.turbineStatus === 'stopped') {
      newValue = Math.max(5, Math.min(newValue, 10));
      newValue += (Math.random() - 0.5) * 1.0; // Add more variation
    } 
    // If turbine is unstable, add much more fluctuation
    else if (well.turbineStatus === 'unstable') {
      newValue += (Math.random() - 0.5) * 3; // Increased from 2 to 3
      newValue = Math.max(14, Math.min(newValue, 20));
    }
    // Normal operation with some variation
    else {
      newValue = Math.max(17, Math.min(newValue, 20));
    }

    well.turbineCurrent = Math.round(newValue * 10) / 10;

    // Randomly change turbine status (with higher probability for better demonstration)
    if (Math.random() < 0.05) { // Increased from 2% to 5% chance
      const statuses: Array<'normal' | 'unstable' | 'stopped'> = ['normal', 'unstable', 'stopped'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      if (newStatus !== well.turbineStatus) {
        well.turbineStatus = newStatus;
        this.generateTurbineAlarm(well);
      }
    }
  }

  /**
   * Update a well segment with increased variation
   * Note: Liquid height is now in millimeters (max 60mm)
   */
  private updateSegment(segment: WellSegment, well: Well) {
    // Update segment current with larger random fluctuation
    const fluctuation = (Math.random() - 0.5) * 1.0; // Increased from 0.3 to 1.0
    segment.currentValue = Math.max(8, Math.min(20, segment.currentValue + fluctuation));
    segment.currentValue = Math.round(segment.currentValue * 10) / 10;

    // Randomly change liquid height (with higher probability and larger changes)
    if (Math.random() < 0.15) { // Increased from 5% to 15%
      // Change can be -5 to +3 mm (bias towards decrease)
      const change = (Math.random() - 0.6) * 8; // Larger changes
      segment.liquidHeight = Math.max(0, Math.min(60, segment.liquidHeight + change)); // Max 60mm
      segment.liquidHeight = Math.round(segment.liquidHeight * 10) / 10; // Keep one decimal
    }

    // Update segment status based on liquid height (in mm) and current
    // New thresholds: >=20mm = level1 (fault), 5-20mm = level2 (warning), <5mm = level3 (warning)
    if (segment.liquidHeight >= 20 || segment.currentValue < 10) { // >=20mm is level1 (fault)
      segment.status = 'fault';
    } else if (segment.liquidHeight > 0 || segment.currentValue < 16) { // Any liquid > 0mm is at least warning
      segment.status = 'warning';
    } else {
      segment.status = 'normal'; // No liquid
    }
  }

  /**
   * Update well status based on segments and turbine
   */
  private updateWellStatus(well: Well) {
    const hasFault = well.segments.some(s => s.status === 'fault') || well.turbineStatus === 'stopped';
    const hasWarning = well.segments.some(s => s.status === 'warning') || well.turbineStatus === 'unstable';

    if (hasFault) {
      well.status = 'fault';
    } else if (hasWarning) {
      well.status = 'warning';
    } else {
      well.status = 'normal';
    }
  }

  /**
   * Check for new alarms and generate them
   * Note: Thresholds updated - >=20mm = level1, 5-20mm = level2, <5mm = level3
   */
  private checkForAlarms(well: Well) {
    // Check segments for liquid level alarms (in mm)
    // New thresholds: >=20mm = level1 (severe), 5-20mm = level2 (moderate), <5mm = level3 (minor)
    well.segments.forEach(segment => {
      if (segment.liquidHeight >= 20 && Math.random() < 0.15) { // >=20mm = level1 (severe)
        this.generateLiquidAlarm(well, segment, 'level1');
      } else if (segment.liquidHeight >= 5 && segment.liquidHeight < 20 && Math.random() < 0.10) { // 5-20mm = level2 (moderate)
        this.generateLiquidAlarm(well, segment, 'level2');
      } else if (segment.liquidHeight > 0 && segment.liquidHeight < 5 && Math.random() < 0.05) { // <5mm = level3 (minor)
        this.generateLiquidAlarm(well, segment, 'level3');
      }
    });
  }

  /**
   * Generate a liquid level alarm
   */
  private generateLiquidAlarm(well: Well, segment: WellSegment, level: 'level1' | 'level2' | 'level3') {
    const levelNames = { level1: '积液一级', level2: '积液二级', level3: '积液三级' };
    const severityNames = { level1: '严重', level2: '一般', level3: '轻微' };
    
    const newAlarm: AlarmRecord = {
      id: `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      wellId: well.id,
      wellName: well.name,
      zone: well.zone,
      faultType: levelNames[level],
      faultLevel: level,
      segmentId: segment.id,
      faultTime: formatDateTime(),
      processResult: 'unprocessed',
      faultReason: `${segment.segmentName}检测到${severityNames[level]}积液，积液高度约${segment.liquidHeight.toFixed(1)}mm，电流值${segment.currentValue}A`,
      faultRange: formatDateTime(),
    };

    alarmRecords.unshift(newAlarm);
    this.notifyAlarmUpdates();
  }

  /**
   * Generate a turbine alarm
   */
  private generateTurbineAlarm(well: Well) {
    const statusNames = {
      normal: '涡轮机正常',
      unstable: '涡轮机不稳定',
      stopped: '涡轮机停止'
    };
    
    const reasons = {
      normal: '涡轮机运行正常，电流稳定',
      unstable: '涡轮机电流波动较大，运行不稳定，建议检查',
      stopped: '涡轮机电流严重异常，设备停止运行，需立即检修'
    };
    
    const newAlarm: AlarmRecord = {
      id: `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      wellId: well.id,
      wellName: well.name,
      zone: well.zone,
      faultType: statusNames[well.turbineStatus],
      turbineStatus: well.turbineStatus,
      faultTime: formatDateTime(),
      processResult: 'unprocessed',
      faultReason: `${reasons[well.turbineStatus]}，当前电流${well.turbineCurrent}A`,
      faultRange: formatDateTime(),
    };

    alarmRecords.unshift(newAlarm);
    this.notifyAlarmUpdates();
  }

  /**
   * Notify all well update listeners
   */
  private notifyWellUpdates() {
    this.updateCallbacks.forEach(callback => callback([...this.wells]));
  }

  /**
   * Notify all alarm update listeners
   */
  private notifyAlarmUpdates() {
    this.alarmCallbacks.forEach(callback => callback([...alarmRecords]));
  }
}

// Singleton instance
let simulationInstance: SimulationService | null = null;

export function getSimulationService(): SimulationService {
  if (!simulationInstance) {
    simulationInstance = new SimulationService();
  }
  return simulationInstance;
}
