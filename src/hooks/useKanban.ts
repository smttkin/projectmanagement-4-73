
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '@/services';
import { KanbanWorksheet, Task, Column } from '@/types/kanban';

export function useKanban(projectId: string) {
  const [worksheets, setWorksheets] = useState<KanbanWorksheet[]>([]);
  const [activeWorksheet, setActiveWorksheet] = useState<string | null>(null);

  // Fetch kanban data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['kanban', projectId],
    queryFn: () => kanbanService.getKanbanWorksheets(projectId)
  });

  // Set worksheets and active worksheet when data is loaded
  useState(() => {
    if (data) {
      setWorksheets(data);
      
      // Set the first worksheet as active if none is selected
      if (!activeWorksheet && data.length > 0) {
        setActiveWorksheet(data[0].id);
      }
    }
  });

  // Get the currently active worksheet
  const getActiveWorksheet = useCallback(() => {
    if (!activeWorksheet || !worksheets.length) return null;
    return worksheets.find(ws => ws.id === activeWorksheet) || null;
  }, [worksheets, activeWorksheet]);

  // Add a new column to active worksheet
  const addColumn = useCallback(async (columnData: Omit<Column, 'id' | 'tasks'>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addColumn(projectId, activeWorksheet, columnData);
      refetch();
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Update a column in active worksheet
  const updateColumn = useCallback(async (columnId: string, columnData: Partial<Column>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.updateColumn(projectId, activeWorksheet, columnId, columnData);
      refetch();
    } catch (error) {
      console.error('Failed to update column:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Delete a column from active worksheet
  const deleteColumn = useCallback(async (columnId: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.deleteColumn(projectId, activeWorksheet, columnId);
      refetch();
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Add a task to a column
  const addTask = useCallback(async (columnId: string, taskData: Omit<Task, 'id'>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addTask(projectId, activeWorksheet, columnId, taskData);
      refetch();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Update a task
  const updateTask = useCallback(async (columnId: string, taskId: string, taskData: Partial<Task>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.updateTask(projectId, activeWorksheet, columnId, taskId, taskData);
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Delete a task
  const deleteTask = useCallback(async (columnId: string, taskId: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.deleteTask(projectId, activeWorksheet, columnId, taskId);
      refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Move a task between columns
  const moveTask = useCallback(async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.moveTask(
        projectId,
        activeWorksheet,
        taskId,
        sourceColumnId,
        destinationColumnId,
        destinationIndex
      );
      refetch();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Add a new worksheet
  const addWorksheet = useCallback(async (name: string) => {
    try {
      const newWorksheet = await kanbanService.addWorksheet(projectId, { name });
      refetch();
      return newWorksheet;
    } catch (error) {
      console.error('Failed to add worksheet:', error);
      return null;
    }
  }, [projectId, refetch]);

  // Add a comment to a task
  const addComment = useCallback(async (
    columnId: string,
    taskId: string,
    comment: { text: string, userId: string }
  ) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addTaskComment(
        projectId,
        activeWorksheet,
        columnId,
        taskId,
        comment
      );
      refetch();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  // Add an attachment to a task
  const addAttachment = useCallback(async (
    columnId: string,
    taskId: string,
    attachment: { name: string, url: string, type: string, size: number }
  ) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addTaskAttachment(
        projectId,
        activeWorksheet,
        columnId,
        taskId,
        attachment
      );
      refetch();
    } catch (error) {
      console.error('Failed to add attachment:', error);
    }
  }, [projectId, activeWorksheet, refetch]);

  return {
    worksheets,
    activeWorksheet,
    setActiveWorksheet,
    getActiveWorksheet,
    isLoading,
    error,
    refetch,
    addColumn,
    updateColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addWorksheet,
    addComment,
    addAttachment
  };
}
