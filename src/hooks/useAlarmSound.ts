import { useEffect, useRef, useState } from 'react';
import { getAlarmVolume } from '../utils/settings';

/**
 * Custom hook for managing alarm sounds
 * Supports both custom audio files and generated alarm sounds
 * Volume is dynamically controlled from system settings
 * 
 * To use a custom sound file:
 * 1. Place your alarm sound file (MP3, WAV, etc.) in the public directory
 * 2. Name it "alarm.mp3" or update the soundUrl parameter
 * 3. The sound will play in a loop when unprocessed alarms exist
 */
export const useAlarmSound = (shouldPlay: boolean, soundUrl: string = '/alarm.mp3') => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useGeneratedSound, setUseGeneratedSound] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const hasInitializedAudio = useRef(false);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Generate an urgent alarm sound using Web Audio API
  const playGeneratedAlarm = () => {
    if (!audioContextRef.current) {
      // Type-safe way to handle webkit prefix
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext as typeof AudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    const ctx = audioContextRef.current;
    
    // Stop any existing oscillator
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }

    // Create oscillator for the alarm tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Create an urgent, attention-grabbing sound
    // Alternate between two frequencies for a classic alarm sound
    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // Start frequency
    
    // Volume control (0.0 to 1.0) - get from system settings
    const volume = getAlarmVolume() / 100; // Convert 0-100 to 0.0-1.0
    gainNode.gain.value = volume;
    gainNodeRef.current = gainNode;
    
    oscillator.start();
    
    // Alternate between two frequencies rapidly for urgency
    let high = true;
    const beepInterval = window.setInterval(() => {
      if (oscillatorRef.current) {
        oscillator.frequency.value = high ? 800 : 600;
        high = !high;
      }
    }, 200); // Switch every 200ms for urgency
    
    oscillatorRef.current = oscillator;
    intervalRef.current = beepInterval;
    
    // Auto-stop after 2 seconds and replay
    timeoutRef.current = window.setTimeout(() => {
      try {
        oscillator.stop();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (shouldPlay) {
          // Replay after a short pause for continuous alarm
          timeoutRef.current = window.setTimeout(() => {
            if (shouldPlay) {
              playGeneratedAlarm();
            }
          }, 300);
        }
      } catch (e) {
        // Ignore if already stopped
      }
    }, 2000);
  };

  // Stop the generated alarm sound
  const stopGeneratedAlarm = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      oscillatorRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Initialize audio element once
  useEffect(() => {
    if (!hasInitializedAudio.current && !useGeneratedSound) {
      const audio = new Audio();
      audio.src = soundUrl;
      audio.loop = true;
      // Get volume from system settings
      const volume = getAlarmVolume() / 100; // Convert 0-100 to 0.0-1.0
      audio.volume = volume;
      
      // Check if the audio file exists
      audio.addEventListener('error', () => {
        console.warn('Custom alarm sound file not found, using generated alarm sound');
        setUseGeneratedSound(true);
      });
      
      audioRef.current = audio;
      hasInitializedAudio.current = true;
    }
  }, [soundUrl, useGeneratedSound]);

  // Control alarm playback based on shouldPlay
  useEffect(() => {
    if (shouldPlay && !isPlaying) {
      if (useGeneratedSound) {
        playGeneratedAlarm();
      } else if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.warn('Failed to play custom alarm sound, using generated alarm sound:', error);
          setUseGeneratedSound(true);
        });
      }
      setIsPlaying(true);
    } else if (!shouldPlay && isPlaying) {
      if (useGeneratedSound) {
        stopGeneratedAlarm();
      } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, [shouldPlay, isPlaying, useGeneratedSound]);

  // Update volume dynamically when settings change
  useEffect(() => {
    const updateVolume = () => {
      const volume = getAlarmVolume() / 100; // Convert 0-100 to 0.0-1.0
      
      // Update audio element volume if it exists
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
      
      // Update gain node volume if it exists
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.value = volume;
      }
    };
    
    // Listen for storage changes to update volume in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'systemSettings') {
        updateVolume();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 2 seconds (for same-tab changes)
    const intervalId = window.setInterval(updateVolume, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopGeneratedAlarm();
    };
  }, []);

  return { isPlaying };
};
