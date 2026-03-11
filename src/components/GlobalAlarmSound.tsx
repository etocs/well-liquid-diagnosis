import React, { useEffect } from 'react';
import { useAlarm } from '../contexts/AlarmContext';
import { useAlarmSound } from '../hooks/useAlarmSound';

/**
 * Global alarm sound component that plays alarm sounds
 * whenever there are unprocessed alarms, regardless of current page
 */
const GlobalAlarmSound: React.FC = () => {
  const { alarmCount } = useAlarm();
  const hasUnprocessedAlarms = alarmCount > 0;
  
  // Use the alarm sound hook
  useAlarmSound(hasUnprocessedAlarms);
  
  // This component doesn't render anything
  return null;
};

export default GlobalAlarmSound;
