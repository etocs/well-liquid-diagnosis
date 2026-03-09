import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Well } from '../types';
import { getAlarmRecords } from '../services/api';

interface AlarmContextType {
  hasActiveAlarm: boolean;
  alarmCount: number;
  checkAlarms: (wells: Well[]) => void;
  acknowledgeAlarms: () => void;
  refreshAlarmCount: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasActiveAlarm, setHasActiveAlarm] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create audio context once
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Handle alarm sound playback
  useEffect(() => {
    const playAlarmSound = () => {
      if (!hasActiveAlarm || !audioContextRef.current) return;
      
      const audioContext = audioContextRef.current;
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

  // Fetch unprocessed alarm count from API
  const refreshAlarmCount = useCallback(async () => {
    try {
      const result = await getAlarmRecords({ pageNum: 1, pageSize: 1000 });
      const unprocessedCount = result.list.filter(alarm => alarm.processResult === 'unprocessed').length;
      
      setAlarmCount(unprocessedCount);
      setHasActiveAlarm(unprocessedCount > 0);
    } catch (error) {
      console.error('Failed to fetch alarm count:', error);
    }
  }, []);

  // Refresh alarm count on mount and periodically
  useEffect(() => {
    refreshAlarmCount();
    const intervalId = window.setInterval(refreshAlarmCount, 30000); // Refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshAlarmCount]);

  const checkAlarms = useCallback((wells: Well[]) => {
    // This method is kept for backwards compatibility but now triggers a refresh
    refreshAlarmCount();
  }, [refreshAlarmCount]);

  const acknowledgeAlarms = useCallback(() => {
    // Don't just acknowledge - the alarm should disappear only when processed
    // This now just navigates to alarm page, alarm will stop when all processed
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  return (
    <AlarmContext.Provider value={{ hasActiveAlarm, alarmCount, checkAlarms, acknowledgeAlarms, refreshAlarmCount }}>
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
