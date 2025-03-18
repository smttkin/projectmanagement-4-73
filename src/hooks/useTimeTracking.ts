
import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimeEntry {
  id: string;
  startTime: Date;
  endTime: Date;
}

export function useTimeTracking(
  projectId: string,
  onTimeEntriesUpdated?: (timeEntriesCount: number) => void
) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Load time entries from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem(`timeEntries-${projectId}`);
    const storedTrackingState = localStorage.getItem(`timeTracking-${projectId}`);
    
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries, (key, value) => {
          if (key === 'startTime' || key === 'endTime') return new Date(value);
          return value;
        });
        setTimeEntries(parsedEntries);
      } catch (error) {
        console.error('Error parsing time entries:', error);
      }
    }
    
    if (storedTrackingState) {
      try {
        const { isTracking, startTime } = JSON.parse(storedTrackingState);
        if (isTracking && startTime) {
          setIsTracking(true);
          startTimeRef.current = new Date(startTime);
          
          // Calculate elapsed time since tracking started
          const elapsedSeconds = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
          setElapsedTime(elapsedSeconds);
          
          // Start timer again
          startTimer();
        }
      } catch (error) {
        console.error('Error parsing tracking state:', error);
      }
    }
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [projectId]);
  
  // Update localStorage when time entries change
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem(`timeEntries-${projectId}`, JSON.stringify(timeEntries));
      
      if (onTimeEntriesUpdated) {
        onTimeEntriesUpdated(timeEntries.length);
      }
    }
  }, [timeEntries, projectId, onTimeEntriesUpdated]);
  
  // Save tracking state to localStorage
  useEffect(() => {
    if (isTracking && startTimeRef.current) {
      localStorage.setItem(`timeTracking-${projectId}`, JSON.stringify({
        isTracking,
        startTime: startTimeRef.current.toISOString()
      }));
    } else {
      localStorage.removeItem(`timeTracking-${projectId}`);
    }
  }, [isTracking, projectId]);
  
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
        setElapsedTime(elapsedSeconds);
      }
    }, 1000);
  }, []);
  
  const startTracking = useCallback(() => {
    const now = new Date();
    startTimeRef.current = now;
    setIsTracking(true);
    setElapsedTime(0);
    startTimer();
  }, [startTimer]);
  
  const stopTracking = useCallback(() => {
    if (!startTimeRef.current) return;
    
    const entry: TimeEntry = {
      id: Date.now().toString(),
      startTime: startTimeRef.current,
      endTime: new Date()
    };
    
    setTimeEntries(prev => [...prev, entry]);
    setIsTracking(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return entry;
  }, []);
  
  const deleteTimeEntry = useCallback((id: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);
  
  return {
    timeEntries,
    isTracking,
    elapsedTime,
    startTracking,
    stopTracking,
    deleteTimeEntry
  };
}
