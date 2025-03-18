
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export function useTaskList(
  projectId: string,
  onTasksUpdated?: (totalTasks: number, completedTasks: number) => void
) {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(`tasks-${projectId}`);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks:', error);
      }
    }
  }, [projectId]);
  
  // Update localStorage and notify parent when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks-${projectId}`, JSON.stringify(tasks));
    }
    
    const completedCount = tasks.filter(task => task.completed).length;
    if (onTasksUpdated) {
      onTasksUpdated(tasks.length, completedCount);
    }
  }, [tasks, projectId, onTasksUpdated]);
  
  // Add a new task
  const addTask = useCallback((description: string) => {
    const task: Task = {
      id: Date.now().toString(),
      description,
      completed: false,
      createdAt: new Date()
    };
    
    setTasks(prev => [...prev, task]);
    return task;
  }, []);
  
  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  }, []);
  
  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted");
  }, []);
  
  // Clear all tasks
  const clearTasks = useCallback(() => {
    setTasks([]);
    localStorage.removeItem(`tasks-${projectId}`);
  }, [projectId]);
  
  // Calculated properties
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  
  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearTasks,
    totalTasks,
    completedTasks
  };
}
