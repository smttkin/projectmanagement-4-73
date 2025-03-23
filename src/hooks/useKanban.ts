
import { useState, useEffect, useCallback } from 'react';
import { KanbanTask, KanbanWorksheet, KanbanStatus, KanbanColumn } from '@/types/kanban';
import { toast } from 'sonner';

const DEFAULT_COLUMNS = [
  { status: 'todo', title: 'To Do', color: 'bg-slate-100' },
  { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { status: 'review', title: 'Review', color: 'bg-amber-100' },
  { status: 'done', title: 'Done', color: 'bg-green-100' }
];

export function useKanban(projectId: string) {
  const [worksheets, setWorksheets] = useState<KanbanWorksheet[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
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

    const loadColumns = () => {
      try {
        const storedColumns = localStorage.getItem(`kanban-columns-${projectId}`);
        if (storedColumns) {
          const parsedColumns = JSON.parse(storedColumns);
          setColumns(parsedColumns);
        }
      } catch (error) {
        console.error('Error loading columns:', error);
      }
    };

    loadWorksheets();
    loadTasks();
    loadColumns();
    setLoading(false);
  }, [projectId, currentWorksheet]);

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

  // Save columns to localStorage when they change
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem(`kanban-columns-${projectId}`, JSON.stringify(columns));
    }
  }, [columns, projectId]);

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

    // Create default columns for the new worksheet
    const newColumns = DEFAULT_COLUMNS.map((col, index) => ({
      id: `col-${Date.now()}-${index}`,
      title: col.title,
      status: col.status,
      color: col.color,
      order: index,
      worksheetId: newWorksheet.id
    }));

    setColumns(prev => [...prev, ...newColumns]);
    
    toast.success('Worksheet created');
    return newWorksheet;
  }, [projectId]);

  // Get columns for current worksheet
  const getCurrentWorksheetColumns = useCallback(() => {
    if (!currentWorksheet) return [];
    
    // If no columns exist for this worksheet, create default ones
    const worksheetColumns = columns.filter(col => col.worksheetId === currentWorksheet.id);
    
    if (worksheetColumns.length === 0 && currentWorksheet) {
      const defaultColumns = DEFAULT_COLUMNS.map((col, index) => ({
        id: `col-${Date.now()}-${index}`,
        title: col.title,
        status: col.status,
        color: col.color,
        order: index,
        worksheetId: currentWorksheet.id
      }));
      
      setColumns(prev => [...prev, ...defaultColumns]);
      return defaultColumns;
    }
    
    return worksheetColumns.sort((a, b) => a.order - b.order);
  }, [columns, currentWorksheet]);

  // Create a new column
  const createColumn = useCallback((title: string, color: string = 'bg-slate-100') => {
    if (!currentWorksheet) return null;
    
    const worksheetColumns = getCurrentWorksheetColumns();
    const newOrder = worksheetColumns.length;
    
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title,
      status: title.toLowerCase().replace(/\s+/g, '-'),
      color,
      order: newOrder,
      worksheetId: currentWorksheet.id
    };
    
    setColumns(prev => [...prev, newColumn]);
    toast.success('Column created');
    return newColumn;
  }, [currentWorksheet, getCurrentWorksheetColumns]);

  // Update a column
  const updateColumn = useCallback((columnId: string, updates: Partial<KanbanColumn>) => {
    setColumns(prev => prev.map(column => 
      column.id === columnId 
        ? { ...column, ...updates } 
        : column
    ));
    toast.success('Column updated');
  }, []);

  // Delete a column
  const deleteColumn = useCallback((columnId: string) => {
    const columnToDelete = columns.find(col => col.id === columnId);
    if (!columnToDelete) return;
    
    // Move tasks in this column to the first column or create a "Backlog" column
    const worksheetColumns = columns.filter(col => col.worksheetId === columnToDelete.worksheetId);
    let targetColumn: KanbanColumn | undefined;
    
    if (worksheetColumns.length > 1) {
      // Find the first column that's not the one being deleted
      targetColumn = worksheetColumns.find(col => col.id !== columnId);
    } else {
      // Create a new "Backlog" column
      const backlogColumn: KanbanColumn = {
        id: `col-${Date.now()}`,
        title: 'Backlog',
        status: 'backlog',
        color: 'bg-slate-100',
        order: 0,
        worksheetId: columnToDelete.worksheetId
      };
      
      setColumns(prev => [...prev, backlogColumn]);
      targetColumn = backlogColumn;
    }
    
    if (targetColumn) {
      // Move tasks to the target column
      setTasks(prev => prev.map(task => 
        task.status === columnToDelete.status 
          ? { ...task, status: targetColumn!.status } 
          : task
      ));
    }
    
    // Remove the column
    setColumns(prev => prev.filter(col => col.id !== columnId));
    
    // Reorder remaining columns
    const remainingColumns = columns.filter(col => 
      col.worksheetId === columnToDelete.worksheetId && col.id !== columnId
    );
    
    if (remainingColumns.length > 0) {
      const reorderedColumns = remainingColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      setColumns(prev => 
        prev.filter(col => col.worksheetId !== columnToDelete.worksheetId)
          .concat(reorderedColumns)
      );
    }
    
    toast.success('Column deleted');
  }, [columns]);

  // Reorder columns
  const reorderColumns = useCallback((columnId: string, newOrder: number) => {
    const columnToMove = columns.find(col => col.id === columnId);
    if (!columnToMove) return;
    
    const worksheetColumns = columns.filter(col => col.worksheetId === columnToMove.worksheetId)
      .sort((a, b) => a.order - b.order);
    
    const updatedColumns = [...worksheetColumns];
    const oldIndex = updatedColumns.findIndex(col => col.id === columnId);
    
    if (oldIndex === -1) return;
    
    // Remove the column from its old position
    const [removed] = updatedColumns.splice(oldIndex, 1);
    // Insert it at the new position
    updatedColumns.splice(newOrder, 0, removed);
    
    // Update the order of all columns
    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index
    }));
    
    setColumns(prev => 
      prev.filter(col => col.worksheetId !== columnToMove.worksheetId)
        .concat(reorderedColumns)
    );
  }, [columns]);

  // Create a new task
  const createTask = useCallback((data: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId' | 'worksheetId'>) => {
    if (!currentWorksheet) return null;
    
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      ...data,
      projectId,
      worksheetId: currentWorksheet.id,
      createdAt: new Date(),
      comments: [],
      attachments: []
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

  // Add a comment to a task
  const addComment = useCallback((taskId: string, content: string, authorId: string, authorName: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      authorId,
      authorName,
      createdAt: new Date(),
      taskId,
      replies: []
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            comments: task.comments ? [...task.comments, newComment] : [newComment] 
          } 
        : task
    ));
    
    toast.success('Comment added');
    return newComment;
  }, []);

  // Add a reply to a comment
  const addReply = useCallback((taskId: string, commentId: string, content: string, authorId: string, authorName: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      content,
      authorId,
      authorName,
      createdAt: new Date(),
      taskId
    };
    
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId || !task.comments) return task;
      
      return {
        ...task,
        comments: task.comments.map(comment => 
          comment.id === commentId
            ? { 
                ...comment, 
                replies: comment.replies ? [...comment.replies, newReply] : [newReply] 
              }
            : comment
        )
      };
    }));
    
    toast.success('Reply added');
    return newReply;
  }, []);

  // Add attachment to a task
  const addAttachment = useCallback((taskId: string, name: string, url: string, type: string, size: number) => {
    const newAttachment = {
      id: `attachment-${Date.now()}`,
      name,
      url,
      type,
      size,
      taskId,
      createdAt: new Date()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            attachments: task.attachments ? [...task.attachments, newAttachment] : [newAttachment] 
          } 
        : task
    ));
    
    toast.success('Attachment added');
    return newAttachment;
  }, []);

  // Get tasks for current worksheet
  const getCurrentWorksheetTasks = useCallback(() => {
    if (!currentWorksheet) return [];
    return tasks.filter(task => task.worksheetId === currentWorksheet.id);
  }, [tasks, currentWorksheet]);

  // Group tasks by status
  const getTasksByStatus = useCallback(() => {
    const currentTasks = getCurrentWorksheetTasks();
    const worksheetColumns = getCurrentWorksheetColumns();
    
    const tasksByStatus: Record<string, KanbanTask[]> = {};
    
    worksheetColumns.forEach(column => {
      tasksByStatus[column.status] = currentTasks.filter(task => task.status === column.status);
    });
    
    return tasksByStatus;
  }, [getCurrentWorksheetTasks, getCurrentWorksheetColumns]);

  return {
    worksheets,
    currentWorksheet,
    setCurrentWorksheet,
    tasks,
    columns: getCurrentWorksheetColumns(),
    loading,
    createWorksheet,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createTask,
    updateTask, 
    deleteTask,
    moveTask,
    addComment,
    addReply,
    addAttachment,
    getCurrentWorksheetTasks,
    getTasksByStatus
  };
}
