import type { Well, WellSegment, AlarmRecord } from '../types';
import { wells as initialWells, alarmRecords } from '../mock/data';
import { formatDateTime } from '../utils/date';

export class SimulationService {
  private wells: Well[];
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private updateCallbacks: Array<(wells: Well[]) => void> = [];
  private alarmCallbacks: Array<(alarms: AlarmRecord[]) => void> = [];

  constructor() {
    this.wells = JSON.parse(JSON.stringify(initialWells)); // Deep clone
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
   * Main simulation update logic
   */
  private updateSimulation() {
    this.wells.forEach(well => {
      // Update turbine current with some randomness
      this.updateTurbineCurrent(well);

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
   * Update turbine current value
   */
  private updateTurbineCurrent(well: Well) {
    const baseValue = well.turbineCurrent;
    
    // Add random fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.5;
    let newValue = baseValue + fluctuation;

    // If turbine is stopped, keep it low
    if (well.turbineStatus === 'stopped') {
      newValue = Math.max(5, Math.min(newValue, 10));
    } 
    // If turbine is unstable, add more fluctuation
    else if (well.turbineStatus === 'unstable') {
      newValue += (Math.random() - 0.5) * 2;
      newValue = Math.max(15, Math.min(newValue, 20));
    }
    // Normal operation
    else {
      newValue = Math.max(17, Math.min(newValue, 20));
    }

    well.turbineCurrent = Math.round(newValue * 10) / 10;

    // Randomly change turbine status (with low probability)
    if (Math.random() < 0.02) { // 2% chance every update
      const statuses: Array<'normal' | 'unstable' | 'stopped'> = ['normal', 'unstable', 'stopped'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      if (newStatus !== well.turbineStatus) {
        well.turbineStatus = newStatus;
        this.generateTurbineAlarm(well);
      }
    }
  }

  /**
   * Update a well segment
   */
  private updateSegment(segment: WellSegment, well: Well) {
    // Update segment current with random fluctuation
    const fluctuation = (Math.random() - 0.5) * 0.3;
    segment.currentValue = Math.max(8, Math.min(20, segment.currentValue + fluctuation));
    segment.currentValue = Math.round(segment.currentValue * 10) / 10;

    // Randomly change liquid height (with low probability)
    if (Math.random() < 0.05) { // 5% chance
      const change = (Math.random() - 0.4) * 50; // Bias towards decrease
      segment.liquidHeight = Math.max(0, segment.liquidHeight + change);
      segment.liquidHeight = Math.round(segment.liquidHeight);
    }

    // Update segment status based on liquid height and current
    if (segment.liquidHeight > 400 || segment.currentValue < 10) {
      segment.status = 'fault';
    } else if (segment.liquidHeight > 100 || segment.currentValue < 16) {
      segment.status = 'warning';
    } else {
      segment.status = 'normal';
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
   */
  private checkForAlarms(well: Well) {
    // Check segments for liquid level alarms
    well.segments.forEach(segment => {
      if (segment.liquidHeight > 400 && Math.random() < 0.1) {
        this.generateLiquidAlarm(well, segment, 'level1');
      } else if (segment.liquidHeight > 200 && Math.random() < 0.05) {
        this.generateLiquidAlarm(well, segment, 'level2');
      } else if (segment.liquidHeight > 50 && Math.random() < 0.02) {
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
      faultReason: `${segment.segmentName}检测到${severityNames[level]}积液，积液高度约${Math.round(segment.liquidHeight)}m，电流值${segment.currentValue}A`,
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
