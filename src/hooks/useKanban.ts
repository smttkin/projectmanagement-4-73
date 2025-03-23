
import { useState, useEffect, useCallback } from 'react';
import { KanbanTask, KanbanWorksheet, KanbanStatus, KanbanColumn } from '@/types/kanban';
import { kanbanService } from '@/services';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useKanban(projectId: string) {
  const [currentWorksheet, setCurrentWorksheet] = useState<KanbanWorksheet | null>(null);
  const queryClient = useQueryClient();

  // Fetch worksheets
  const { 
    data: worksheets = [], 
    isLoading: isLoadingWorksheets 
  } = useQuery({
    queryKey: ['worksheets', projectId],
    queryFn: () => kanbanService.getWorksheets(projectId),
    onSuccess: (data) => {
      // Set the first worksheet as current if none selected
      if (data.length > 0 && !currentWorksheet) {
        setCurrentWorksheet(data[0]);
      }
    }
  });

  // Fetch columns for current worksheet
  const { 
    data: columns = [], 
    isLoading: isLoadingColumns 
  } = useQuery({
    queryKey: ['columns', projectId, currentWorksheet?.id],
    queryFn: () => currentWorksheet 
      ? kanbanService.getColumns(projectId, currentWorksheet.id) 
      : Promise.resolve([]),
    enabled: !!currentWorksheet
  });

  // Fetch tasks for current worksheet
  const { 
    data: tasks = [], 
    isLoading: isLoadingTasks 
  } = useQuery({
    queryKey: ['tasks', projectId, currentWorksheet?.id],
    queryFn: () => currentWorksheet 
      ? kanbanService.getTasks(projectId, currentWorksheet.id) 
      : Promise.resolve([]),
    enabled: !!currentWorksheet
  });

  // Create worksheet mutation
  const createWorksheetMutation = useMutation({
    mutationFn: (data: Pick<KanbanWorksheet, 'title' | 'description'>) => 
      kanbanService.createWorksheet(projectId, data),
    onSuccess: (newWorksheet) => {
      queryClient.invalidateQueries({ queryKey: ['worksheets', projectId] });
      setCurrentWorksheet(newWorksheet);
    }
  });

  // Create column mutation
  const createColumnMutation = useMutation({
    mutationFn: (data: { title: string; color: string }) => 
      currentWorksheet 
        ? kanbanService.createColumn(projectId, { ...data, worksheetId: currentWorksheet.id }) 
        : Promise.reject('No worksheet selected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId, currentWorksheet?.id] });
    }
  });

  // Update column mutation
  const updateColumnMutation = useMutation({
    mutationFn: ({ columnId, updates }: { columnId: string, updates: Partial<KanbanColumn> }) => 
      kanbanService.updateColumn(projectId, columnId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId, currentWorksheet?.id] });
    }
  });

  // Delete column mutation
  const deleteColumnMutation = useMutation({
    mutationFn: (columnId: string) => kanbanService.deleteColumn(projectId, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId, currentWorksheet?.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId' | 'worksheetId' | 'comments' | 'attachments'>) => 
      currentWorksheet 
        ? kanbanService.createTask(projectId, { ...data, worksheetId: currentWorksheet.id }) 
        : Promise.reject('No worksheet selected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string, updates: Partial<KanbanTask> }) => 
      kanbanService.updateTask(projectId, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => kanbanService.deleteTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ 
      taskId, 
      content, 
      authorId, 
      authorName 
    }: { 
      taskId: string; 
      content: string; 
      authorId: string; 
      authorName: string 
    }) => 
      kanbanService.addComment(projectId, taskId, { content, authorId, authorName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Add attachment mutation
  const addAttachmentMutation = useMutation({
    mutationFn: ({ 
      taskId, 
      name, 
      url, 
      type, 
      size 
    }: { 
      taskId: string; 
      name: string; 
      url: string; 
      type: string; 
      size: number 
    }) => 
      kanbanService.addAttachment(projectId, taskId, { name, url, type, size }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId, currentWorksheet?.id] });
    }
  });

  // Create a new worksheet
  const createWorksheet = useCallback((title: string, description?: string) => {
    createWorksheetMutation.mutate({ title, description });
  }, [createWorksheetMutation]);

  // Create a new column
  const createColumn = useCallback((title: string, color: string = 'bg-slate-100') => {
    createColumnMutation.mutate({ title, color });
  }, [createColumnMutation]);

  // Update a column
  const updateColumn = useCallback((columnId: string, updates: Partial<KanbanColumn>) => {
    updateColumnMutation.mutate({ columnId, updates });
  }, [updateColumnMutation]);

  // Delete a column
  const deleteColumn = useCallback((columnId: string) => {
    deleteColumnMutation.mutate(columnId);
  }, [deleteColumnMutation]);

  // Create a new task
  const createTask = useCallback((data: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId' | 'worksheetId'>) => {
    createTaskMutation.mutate(data);
  }, [createTaskMutation]);

  // Update a task
  const updateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    updateTaskMutation.mutate({ taskId, updates });
  }, [updateTaskMutation]);

  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  }, [deleteTaskMutation]);

  // Move a task to a different status
  const moveTask = useCallback((taskId: string, newStatus: KanbanStatus) => {
    updateTaskMutation.mutate({ taskId, updates: { status: newStatus } });
  }, [updateTaskMutation]);

  // Add a comment to a task
  const addComment = useCallback((taskId: string, content: string, authorId: string, authorName: string) => {
    addCommentMutation.mutate({ taskId, content, authorId, authorName });
  }, [addCommentMutation]);

  // Add attachment to a task
  const addAttachment = useCallback((taskId: string, name: string, url: string, type: string, size: number) => {
    addAttachmentMutation.mutate({ taskId, name, url, type, size });
  }, [addAttachmentMutation]);

  // Group tasks by status for display
  const getTasksByStatus = useCallback(() => {
    const tasksByStatus: Record<string, KanbanTask[]> = {};
    
    columns.forEach(column => {
      tasksByStatus[column.status] = tasks.filter(task => task.status === column.status);
    });
    
    return tasksByStatus;
  }, [tasks, columns]);

  const loading = isLoadingWorksheets || isLoadingColumns || isLoadingTasks;

  return {
    worksheets,
    currentWorksheet,
    setCurrentWorksheet,
    tasks,
    columns,
    loading,
    createWorksheet,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask, 
    deleteTask,
    moveTask,
    addComment,
    addAttachment,
    getTasksByStatus
  };
}
