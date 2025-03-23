
import { useState, useCallback, useEffect } from 'react';
import { useKanbanWorksheets } from './kanban/useKanbanWorksheets';
import { useKanbanColumns } from './kanban/useKanbanColumns';
import { useKanbanTasks } from './kanban/useKanbanTasks';
import { KanbanWorksheet, KanbanTask, KanbanColumn as KanbanColumnType } from '@/types/kanban';

export function useKanban(projectId: string) {
  const [activeWorksheet, setActiveWorksheet] = useState<string | null>(null);
  
  // Use the separated hooks for worksheets, columns, and tasks
  const { worksheets, createWorksheet, isLoadingWorksheets, worksheetsError } = useKanbanWorksheets(projectId);
  const { columns, addColumn, updateColumn, deleteColumn, isLoadingColumns, columnsError } = useKanbanColumns(projectId, activeWorksheet);
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    moveTask, 
    addComment, 
    addAttachment,
    isLoadingTasks,
    tasksError
  } = useKanbanTasks(projectId, activeWorksheet);
  
  // Set active worksheet when data is loaded
  useEffect(() => {
    if (worksheets.length > 0 && !activeWorksheet) {
      setActiveWorksheet(worksheets[0].id);
    }
  }, [worksheets, activeWorksheet]);
  
  // Get the currently active worksheet
  const getActiveWorksheet = useCallback(() => {
    if (!activeWorksheet || !worksheets.length) return null;
    return worksheets.find(ws => ws.id === activeWorksheet) || null;
  }, [worksheets, activeWorksheet]);
  
  // Get tasks organized by status
  const getTasksByStatus = useCallback(() => {
    const tasksByStatus: Record<string, KanbanTask[]> = {};
    
    columns.forEach(column => {
      tasksByStatus[column.status] = tasks.filter(task => task.status === column.status);
    });
    
    return tasksByStatus;
  }, [tasks, columns]);
  
  // A setter for the active worksheet
  const setCurrentWorksheet = useCallback((worksheet: KanbanWorksheet) => {
    setActiveWorksheet(worksheet.id);
  }, []);
  
  return {
    worksheets,
    activeWorksheet,
    setActiveWorksheet,
    getActiveWorksheet,
    isLoading: isLoadingWorksheets || isLoadingColumns || isLoadingTasks,
    error: worksheetsError || columnsError || tasksError,
    refetch: () => {
      // The refetch functionality is handled by the individual hooks
    },
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    createWorksheet,
    addComment,
    addAttachment,
    columns,
    tasks,
    getTasksByStatus,
    currentWorksheet: getActiveWorksheet(),
    setCurrentWorksheet
  };
}
