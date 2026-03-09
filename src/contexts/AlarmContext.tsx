import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Well } from '../types';

interface AlarmContextType {
  hasActiveAlarm: boolean;
  alarmCount: number;
  checkAlarms: (wells: Well[]) => void;
  acknowledgeAlarms: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

// Threshold for liquid height alarm (in meters)
const ALARM_THRESHOLD = 500;

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasActiveAlarm, setHasActiveAlarm] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);

  // Create audio element for alarm sound
  useEffect(() => {
    // Create a simple alarm sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playAlarmSound = () => {
      if (!hasActiveAlarm) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    if (hasActiveAlarm) {
      // Play sound immediately
      playAlarmSound();
      
      // Play sound every 3 seconds
      alarmIntervalRef.current = window.setInterval(() => {
        playAlarmSound();
      }, 3000);
    }

    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    };
  }, [hasActiveAlarm]);

  const checkAlarms = useCallback((wells: Well[]) => {
    const alarmedWells = wells.filter(well => well.liquidHeight > ALARM_THRESHOLD);
    const count = alarmedWells.length;
    
    setAlarmCount(count);
    setHasActiveAlarm(count > 0);
  }, []);

  const acknowledgeAlarms = useCallback(() => {
    setHasActiveAlarm(false);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  return (
    <AlarmContext.Provider value={{ hasActiveAlarm, alarmCount, checkAlarms, acknowledgeAlarms }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within AlarmProvider');
  }
  return context;
};
