import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for managing alarm sounds
 * Supports both custom audio files and generated alarm sounds
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
    
    // Volume control (0.0 to 1.0) - set to 0.7 for loud and urgent sound
    gainNode.gain.value = 0.7;
    
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
      audio.volume = 0.8; // Set volume to 80% for loud sound
      
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
