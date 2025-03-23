
import { ApiService } from './api';
import { KanbanTask, KanbanWorksheet, KanbanColumn, KanbanComment, KanbanAttachment } from '@/types/kanban';
import { toast } from 'sonner';

class KanbanService extends ApiService {
  constructor() {
    super('kanban');
  }
  
  // Get storage key for specific project resources
  private getStorageKey(projectId: string, resource: string): string {
    return `${resource}-${projectId}`;
  }
  
  // Generic methods to get and save data to localStorage
  private getData<T>(projectId: string, resource: string): T[] {
    const key = this.getStorageKey(projectId, resource);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  }
  
  private saveData<T>(projectId: string, resource: string, data: T[]): void {
    const key = this.getStorageKey(projectId, resource);
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // Worksheet methods
  async getWorksheets(projectId: string): Promise<KanbanWorksheet[]> {
    try {
      const worksheets = this.getData<KanbanWorksheet>(projectId, 'worksheets');
      
      // Create default worksheet if none exist
      if (worksheets.length === 0) {
        const defaultWorksheet: KanbanWorksheet = {
          id: `ws-${Date.now()}`,
          title: 'Main Board',
          description: 'Default kanban board',
          projectId,
          createdAt: new Date()
        };
        
        this.saveData(projectId, 'worksheets', [defaultWorksheet]);
        return this.simulateResponse([defaultWorksheet]);
      }
      
      return this.simulateResponse(worksheets);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch worksheets');
    }
  }
  
  async createWorksheet(projectId: string, data: Pick<KanbanWorksheet, 'title' | 'description'>): Promise<KanbanWorksheet> {
    try {
      const worksheets = this.getData<KanbanWorksheet>(projectId, 'worksheets');
      
      const newWorksheet: KanbanWorksheet = {
        id: `ws-${Date.now()}`,
        title: data.title,
        description: data.description,
        projectId,
        createdAt: new Date()
      };
      
      this.saveData(projectId, 'worksheets', [...worksheets, newWorksheet]);
      
      toast.success('Worksheet created');
      return this.simulateResponse(newWorksheet);
    } catch (error) {
      return this.handleError(error, 'Failed to create worksheet');
    }
  }
  
  // Column methods
  async getColumns(projectId: string, worksheetId: string): Promise<KanbanColumn[]> {
    try {
      let columns = this.getData<KanbanColumn>(projectId, 'kanban-columns')
        .filter(col => col.worksheetId === worksheetId);
      
      // Create default columns if none exist for this worksheet
      if (columns.length === 0) {
        const defaultColumns = [
          { status: 'todo', title: 'To Do', color: 'bg-slate-100' },
          { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
          { status: 'review', title: 'Review', color: 'bg-amber-100' },
          { status: 'done', title: 'Done', color: 'bg-green-100' }
        ].map((col, index) => ({
          id: `col-${Date.now()}-${index}`,
          title: col.title,
          status: col.status,
          color: col.color,
          order: index,
          worksheetId
        }));
        
        const allColumns = [
          ...this.getData<KanbanColumn>(projectId, 'kanban-columns'),
          ...defaultColumns
        ];
        
        this.saveData(projectId, 'kanban-columns', allColumns);
        return this.simulateResponse(defaultColumns);
      }
      
      return this.simulateResponse(columns.sort((a, b) => a.order - b.order));
    } catch (error) {
      return this.handleError(error, 'Failed to fetch columns');
    }
  }
  
  async createColumn(projectId: string, data: { title: string; color: string; worksheetId: string }): Promise<KanbanColumn> {
    try {
      const columns = this.getData<KanbanColumn>(projectId, 'kanban-columns');
      const worksheetColumns = columns.filter(col => col.worksheetId === data.worksheetId);
      
      const newColumn: KanbanColumn = {
        id: `col-${Date.now()}`,
        title: data.title,
        status: data.title.toLowerCase().replace(/\s+/g, '-'),
        color: data.color,
        order: worksheetColumns.length,
        worksheetId: data.worksheetId
      };
      
      this.saveData(projectId, 'kanban-columns', [...columns, newColumn]);
      
      toast.success('Column created');
      return this.simulateResponse(newColumn);
    } catch (error) {
      return this.handleError(error, 'Failed to create column');
    }
  }
  
  async updateColumn(projectId: string, columnId: string, updates: Partial<KanbanColumn>): Promise<KanbanColumn> {
    try {
      const columns = this.getData<KanbanColumn>(projectId, 'kanban-columns');
      
      const updatedColumns = columns.map(column => 
        column.id === columnId ? { ...column, ...updates } : column
      );
      
      this.saveData(projectId, 'kanban-columns', updatedColumns);
      
      const updatedColumn = updatedColumns.find(col => col.id === columnId);
      if (!updatedColumn) {
        throw new Error('Column not found after update');
      }
      
      toast.success('Column updated');
      return this.simulateResponse(updatedColumn);
    } catch (error) {
      return this.handleError(error, 'Failed to update column');
    }
  }
  
  async deleteColumn(projectId: string, columnId: string): Promise<void> {
    try {
      const columns = this.getData<KanbanColumn>(projectId, 'kanban-columns');
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      
      const columnToDelete = columns.find(col => col.id === columnId);
      if (!columnToDelete) {
        throw new Error('Column not found');
      }
      
      // Find an alternative column or create one
      const worksheetColumns = columns.filter(col => col.worksheetId === columnToDelete.worksheetId);
      let targetColumn: KanbanColumn | undefined;
      
      if (worksheetColumns.length > 1) {
        // Find another column in the same worksheet
        targetColumn = worksheetColumns.find(col => col.id !== columnId);
      } else {
        // Create a new "Backlog" column
        targetColumn = {
          id: `col-${Date.now()}`,
          title: 'Backlog',
          status: 'backlog',
          color: 'bg-slate-100',
          order: 0,
          worksheetId: columnToDelete.worksheetId
        };
        
        // Add the new column
        columns.push(targetColumn);
      }
      
      // Move tasks to the target column
      const updatedTasks = tasks.map(task => 
        task.status === columnToDelete.status ? { ...task, status: targetColumn!.status } : task
      );
      
      // Remove the column
      const remainingColumns = columns.filter(col => col.id !== columnId);
      
      // Reorder columns
      const reorderedColumns = remainingColumns.map((col, index) => 
        col.worksheetId === columnToDelete.worksheetId ? { ...col, order: index } : col
      );
      
      // Save everything
      this.saveData(projectId, 'kanban-columns', reorderedColumns);
      this.saveData(projectId, 'kanban-tasks', updatedTasks);
      
      toast.success('Column deleted');
      return await this.simulateResponse(undefined);
    } catch (error) {
      return this.handleError(error, 'Failed to delete column');
    }
  }
  
  // Task methods
  async getTasks(projectId: string, worksheetId: string): Promise<KanbanTask[]> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks')
        .filter(task => task.worksheetId === worksheetId);
      
      return this.simulateResponse(tasks);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch tasks');
    }
  }
  
  async createTask(projectId: string, data: Omit<KanbanTask, 'id' | 'createdAt' | 'projectId'>): Promise<KanbanTask> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      
      const newTask: KanbanTask = {
        id: `task-${Date.now()}`,
        ...data,
        projectId,
        createdAt: new Date(),
        comments: [],
        attachments: []
      };
      
      this.saveData(projectId, 'kanban-tasks', [...tasks, newTask]);
      
      toast.success('Task created');
      return this.simulateResponse(newTask);
    } catch (error) {
      return this.handleError(error, 'Failed to create task');
    }
  }
  
  async updateTask(projectId: string, taskId: string, updates: Partial<KanbanTask>): Promise<KanbanTask> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      this.saveData(projectId, 'kanban-tasks', updatedTasks);
      
      const updatedTask = updatedTasks.find(task => task.id === taskId);
      if (!updatedTask) {
        throw new Error('Task not found after update');
      }
      
      toast.success('Task updated');
      return this.simulateResponse(updatedTask);
    } catch (error) {
      return this.handleError(error, 'Failed to update task');
    }
  }
  
  async deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      
      this.saveData(projectId, 'kanban-tasks', updatedTasks);
      
      toast.success('Task deleted');
      return await this.simulateResponse(undefined);
    } catch (error) {
      return this.handleError(error, 'Failed to delete task');
    }
  }
  
  // Add comment to task
  async addComment(
    projectId: string, 
    taskId: string, 
    data: { content: string; authorId: string; authorName: string }
  ): Promise<KanbanComment> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      
      const newComment: KanbanComment = {
        id: `comment-${Date.now()}`,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: new Date(),
        taskId,
        replies: []
      };
      
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments ? [...task.comments, newComment] : [newComment]
          };
        }
        return task;
      });
      
      this.saveData(projectId, 'kanban-tasks', updatedTasks);
      
      toast.success('Comment added');
      return this.simulateResponse(newComment);
    } catch (error) {
      return this.handleError(error, 'Failed to add comment');
    }
  }
  
  // Add attachment to task
  async addAttachment(
    projectId: string,
    taskId: string,
    data: { name: string; url: string; type: string; size: number }
  ): Promise<KanbanAttachment> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks');
      
      const newAttachment: KanbanAttachment = {
        id: `attachment-${Date.now()}`,
        name: data.name,
        url: data.url,
        type: data.type,
        size: data.size,
        taskId,
        createdAt: new Date()
      };
      
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            attachments: task.attachments ? [...task.attachments, newAttachment] : [newAttachment]
          };
        }
        return task;
      });
      
      this.saveData(projectId, 'kanban-tasks', updatedTasks);
      
      toast.success('Attachment added');
      return this.simulateResponse(newAttachment);
    } catch (error) {
      return this.handleError(error, 'Failed to add attachment');
    }
  }
}

export const kanbanService = new KanbanService();
