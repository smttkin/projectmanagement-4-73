
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '@/services';
import { KanbanWorksheet, KanbanTask, KanbanColumn as KanbanColumnType } from '@/types/kanban';

export function useKanban(projectId: string) {
  const [worksheets, setWorksheets] = useState<KanbanWorksheet[]>([]);
  const [activeWorksheet, setActiveWorksheet] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

  // Fetch kanban worksheets
  const worksheetsQuery = useQuery({
    queryKey: ['kanban-worksheets', projectId],
    queryFn: () => kanbanService.getWorksheets(projectId)
  });

  // Set worksheets and active worksheet when data is loaded
  useEffect(() => {
    if (worksheetsQuery.data) {
      setWorksheets(worksheetsQuery.data);
      
      // Set the first worksheet as active if none is selected
      if (!activeWorksheet && worksheetsQuery.data.length > 0) {
        setActiveWorksheet(worksheetsQuery.data[0].id);
      }
    }
  }, [worksheetsQuery.data, activeWorksheet]);

  // Fetch columns for active worksheet
  const columnsQuery = useQuery({
    queryKey: ['kanban-columns', projectId, activeWorksheet],
    queryFn: () => activeWorksheet ? kanbanService.getColumns(projectId, activeWorksheet) : Promise.resolve([]),
    enabled: !!activeWorksheet
  });

  // Set columns when data is loaded
  useEffect(() => {
    if (columnsQuery.data) {
      setColumns(columnsQuery.data);
    }
  }, [columnsQuery.data]);

  // Fetch tasks for active worksheet
  const tasksQuery = useQuery({
    queryKey: ['kanban-tasks', projectId, activeWorksheet],
    queryFn: () => activeWorksheet ? kanbanService.getTasks(projectId, activeWorksheet) : Promise.resolve([]),
    enabled: !!activeWorksheet
  });

  // Set tasks when data is loaded
  useEffect(() => {
    if (tasksQuery.data) {
      setTasks(tasksQuery.data);
    }
  }, [tasksQuery.data]);

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

  // Add a new column to active worksheet
  const addColumn = useCallback(async (title: string, color: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.createColumn(projectId, {
        title,
        color,
        worksheetId: activeWorksheet
      });
      columnsQuery.refetch();
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery]);

  // Update a column in active worksheet
  const updateColumn = useCallback(async (columnId: string, columnData: Partial<KanbanColumnType>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.updateColumn(projectId, columnId, columnData);
      columnsQuery.refetch();
    } catch (error) {
      console.error('Failed to update column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery]);

  // Delete a column from active worksheet
  const deleteColumn = useCallback(async (columnId: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.deleteColumn(projectId, columnId);
      columnsQuery.refetch();
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery, tasksQuery]);

  // Add a task to a column
  const addTask = useCallback(async (task: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId'>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.createTask(projectId, task);
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }, [projectId, activeWorksheet, tasksQuery]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, taskData: Partial<KanbanTask>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.updateTask(projectId, taskId, taskData);
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [projectId, activeWorksheet, tasksQuery]);

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.deleteTask(projectId, taskId);
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [projectId, activeWorksheet, tasksQuery]);

  // Move a task between columns
  const moveTask = useCallback(async (taskId: string, newStatus: string) => {
    if (!activeWorksheet) return;
    
    try {
      // Find the task to update its status
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await kanbanService.updateTask(projectId, taskId, { status: newStatus });
        tasksQuery.refetch();
      }
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  }, [projectId, activeWorksheet, tasks, tasksQuery]);

  // Add a new worksheet
  const createWorksheet = useCallback(async (title: string, description?: string) => {
    try {
      const newWorksheet = await kanbanService.createWorksheet(projectId, { title, description });
      worksheetsQuery.refetch();
      return newWorksheet;
    } catch (error) {
      console.error('Failed to add worksheet:', error);
      return null;
    }
  }, [projectId, worksheetsQuery]);

  // Add a comment to a task
  const addComment = useCallback(async (
    taskId: string, 
    content: string,
    authorId: string,
    authorName: string
  ) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addComment(
        projectId,
        taskId,
        { content, authorId, authorName }
      );
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [projectId, activeWorksheet, tasksQuery]);

  // Add an attachment to a task
  const addAttachment = useCallback(async (
    taskId: string,
    name: string,
    url: string,
    type: string,
    size: number
  ) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.addAttachment(
        projectId,
        taskId,
        { name, url, type, size }
      );
      tasksQuery.refetch();
    } catch (error) {
      console.error('Failed to add attachment:', error);
    }
  }, [projectId, activeWorksheet, tasksQuery]);

  // A setter for the active worksheet
  const setCurrentWorksheet = useCallback((worksheet: KanbanWorksheet) => {
    setActiveWorksheet(worksheet.id);
  }, []);

  return {
    worksheets,
    activeWorksheet,
    setActiveWorksheet,
    getActiveWorksheet,
    isLoading: worksheetsQuery.isLoading || columnsQuery.isLoading || tasksQuery.isLoading,
    error: worksheetsQuery.error || columnsQuery.error || tasksQuery.error,
    refetch: () => {
      worksheetsQuery.refetch();
      columnsQuery.refetch();
      tasksQuery.refetch();
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
