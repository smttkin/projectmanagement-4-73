
import { useState, useEffect, useCallback } from 'react';
import { KanbanTask, KanbanWorksheet, KanbanStatus } from '@/types/kanban';
import { toast } from 'sonner';

export function useKanban(projectId: string) {
  const [worksheets, setWorksheets] = useState<KanbanWorksheet[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [currentWorksheet, setCurrentWorksheet] = useState<KanbanWorksheet | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize worksheets and tasks from localStorage
  useEffect(() => {
    const loadWorksheets = () => {
      try {
        const storedWorksheets = localStorage.getItem(`worksheets-${projectId}`);
        const parsedWorksheets = storedWorksheets 
          ? JSON.parse(storedWorksheets, (key, value) => {
              if (key === 'createdAt') return new Date(value);
              return value;
            })
          : [];
        
        setWorksheets(parsedWorksheets);
        
        // Set the first worksheet as current if available
        if (parsedWorksheets.length > 0 && !currentWorksheet) {
          setCurrentWorksheet(parsedWorksheets[0]);
        } else if (parsedWorksheets.length === 0) {
          // Create a default worksheet if none exist
          const defaultWorksheet = {
            id: `ws-${Date.now()}`,
            title: 'Main Board',
            description: 'Default kanban board',
            projectId,
            createdAt: new Date()
          };
          
          setWorksheets([defaultWorksheet]);
          setCurrentWorksheet(defaultWorksheet);
          localStorage.setItem(`worksheets-${projectId}`, JSON.stringify([defaultWorksheet]));
        }
      } catch (error) {
        console.error('Error loading worksheets:', error);
      }
    };

    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem(`kanban-tasks-${projectId}`);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          });
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadWorksheets();
    loadTasks();
    setLoading(false);
  }, [projectId]);

  // Save worksheets to localStorage when they change
  useEffect(() => {
    if (worksheets.length > 0) {
      localStorage.setItem(`worksheets-${projectId}`, JSON.stringify(worksheets));
    }
  }, [worksheets, projectId]);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`kanban-tasks-${projectId}`, JSON.stringify(tasks));
    }
  }, [tasks, projectId]);

  // Create a new worksheet
  const createWorksheet = useCallback((title: string, description?: string) => {
    const newWorksheet: KanbanWorksheet = {
      id: `ws-${Date.now()}`,
      title,
      description,
      projectId,
      createdAt: new Date()
    };
    
    setWorksheets(prev => [...prev, newWorksheet]);
    setCurrentWorksheet(newWorksheet);
    toast.success('Worksheet created');
    return newWorksheet;
  }, [projectId]);

  // Create a new task
  const createTask = useCallback((data: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId' | 'worksheetId'>) => {
    if (!currentWorksheet) return null;
    
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      ...data,
      projectId,
      worksheetId: currentWorksheet.id,
      createdAt: new Date()
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success('Task created');
    return newTask;
  }, [projectId, currentWorksheet]);

  // Update a task
  const updateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates } 
        : task
    ));
    toast.success('Task updated');
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted');
  }, []);

  // Move a task to a different status
  const moveTask = useCallback((taskId: string, newStatus: KanbanStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus } 
        : task
    ));
  }, []);

  // Get tasks for current worksheet
  const getCurrentWorksheetTasks = useCallback(() => {
    if (!currentWorksheet) return [];
    return tasks.filter(task => task.worksheetId === currentWorksheet.id);
  }, [tasks, currentWorksheet]);

  // Group tasks by status
  const getTasksByStatus = useCallback(() => {
    const currentTasks = getCurrentWorksheetTasks();
    return {
      todo: currentTasks.filter(task => task.status === 'todo'),
      'in-progress': currentTasks.filter(task => task.status === 'in-progress'),
      review: currentTasks.filter(task => task.status === 'review'),
      done: currentTasks.filter(task => task.status === 'done')
    };
  }, [getCurrentWorksheetTasks]);

  return {
    worksheets,
    currentWorksheet,
    setCurrentWorksheet,
    tasks,
    loading,
    createWorksheet,
    createTask,
    updateTask, 
    deleteTask,
    moveTask,
    getCurrentWorksheetTasks,
    getTasksByStatus
  };
}
