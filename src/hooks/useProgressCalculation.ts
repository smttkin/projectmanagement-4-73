
import { useState, useEffect, useCallback } from 'react';

interface ProgressOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  persistKey?: string; // Optional key for localStorage persistence
}

export function useProgressCalculation(options: ProgressOptions = {}) {
  const { 
    initialValue = 0, 
    min = 0, 
    max = 100, 
    onChange, 
    persistKey 
  } = options;
  
  // Initialize state from localStorage if persistKey is provided
  const getInitialProgress = () => {
    if (persistKey) {
      try {
        const savedValue = localStorage.getItem(persistKey);
        if (savedValue !== null) {
          return validateProgress(parseFloat(savedValue));
        }
      } catch (error) {
        console.error('Error reading progress from localStorage:', error);
      }
    }
    return validateProgress(initialValue);
  };
  
  const [progress, setProgress] = useState<number>(getInitialProgress);

  // Ensure progress is within bounds
  const validateProgress = useCallback((value: number): number => {
    return Math.max(min, Math.min(max, value));
  }, [min, max]);

  // Set progress with validation
  const updateProgress = useCallback((newValue: number) => {
    const validatedValue = validateProgress(newValue);
    setProgress(validatedValue);
    
    // Persist to localStorage if persistKey is provided
    if (persistKey) {
      localStorage.setItem(persistKey, validatedValue.toString());
    }
    
    // Call onChange handler if provided
    if (onChange) {
      onChange(validatedValue);
    }
  }, [validateProgress, onChange, persistKey]);

  // Increment progress by a specific amount
  const incrementProgress = useCallback((amount: number = 1) => {
    setProgress(prev => {
      const newValue = validateProgress(prev + amount);
      
      // Persist to localStorage if persistKey is provided
      if (persistKey) {
        localStorage.setItem(persistKey, newValue.toString());
      }
      
      // Call onChange handler if provided
      if (onChange) {
        onChange(newValue);
      }
      
      return newValue;
    });
  }, [validateProgress, onChange, persistKey]);

  // Calculate percentage from current/total
  const calculatePercentage = useCallback((current: number, total: number): number => {
    if (total <= 0) return 0;
    return validateProgress(Math.round((current / total) * 100));
  }, [validateProgress]);
  
  // Calculate weighted progress based on multiple factors
  const calculateWeightedProgress = useCallback((factors: { value: number; weight: number }[]): number => {
    if (factors.length === 0) return 0;
    
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    
    if (totalWeight === 0) return 0;
    
    const weightedSum = factors.reduce((sum, factor) => {
      return sum + (factor.value * factor.weight);
    }, 0);
    
    return validateProgress(Math.round(weightedSum / totalWeight));
  }, [validateProgress]);

  // Reset progress to initial value
  const resetProgress = useCallback(() => {
    updateProgress(initialValue);
  }, [initialValue, updateProgress]);

  // Set initial validated value when initialValue changes
  useEffect(() => {
    if (!persistKey) { // Only update if not using persistence
      setProgress(validateProgress(initialValue));
    }
  }, [initialValue, validateProgress, persistKey]);

  return {
    progress,
    setProgress: updateProgress,
    incrementProgress,
    calculatePercentage,
    calculateWeightedProgress,
    resetProgress,
  };
}

export default useProgressCalculation;
