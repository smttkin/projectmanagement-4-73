
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '@/services';
import { KanbanTask } from '@/types/kanban';

export function useKanbanTasks(projectId: string, activeWorksheet: string | null) {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

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

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addComment,
    addAttachment,
    isLoadingTasks: tasksQuery.isLoading,
    tasksError: tasksQuery.error,
    refetchTasks: tasksQuery.refetch
  };
}
