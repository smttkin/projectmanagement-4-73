
import { useState, useEffect } from 'react';

interface ProgressOptions {
  initialValue?: number;
  min?: number;
  max?: number;
}

export function useProgressCalculation(options: ProgressOptions = {}) {
  const { initialValue = 0, min = 0, max = 100 } = options;
  const [progress, setProgress] = useState<number>(initialValue);

  // Ensure progress is within bounds
  const validateProgress = (value: number): number => {
    return Math.max(min, Math.min(max, value));
  };

  // Set progress with validation
  const updateProgress = (newValue: number) => {
    setProgress(validateProgress(newValue));
  };

  // Calculate percentage from current/total
  const calculatePercentage = (current: number, total: number): number => {
    if (total <= 0) return 0;
    return validateProgress(Math.round((current / total) * 100));
  };

  // Set initial validated value
  useEffect(() => {
    setProgress(validateProgress(initialValue));
  }, [initialValue]);

  return {
    progress,
    setProgress: updateProgress,
    calculatePercentage,
  };
}

export default useProgressCalculation;
