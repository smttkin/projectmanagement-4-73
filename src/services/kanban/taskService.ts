
import { KanbanTask, KanbanComment, KanbanAttachment } from '@/types/kanban';
import { toast } from 'sonner';
import { BaseKanbanService } from './baseKanbanService';
import { AddAttachmentParams, AddCommentParams, CreateTaskParams } from './types';

class TaskService extends BaseKanbanService {
  constructor() {
    super('kanban-tasks');
  }
  
  // Get all tasks for a worksheet
  async getTasks(projectId: string, worksheetId: string): Promise<KanbanTask[]> {
    try {
      const tasks = this.getData<KanbanTask>(projectId, 'kanban-tasks')
        .filter(task => task.worksheetId === worksheetId);
      
      return this.simulateResponse(tasks);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch tasks');
    }
  }
  
  // Create a new task
  async createTask(projectId: string, data: CreateTaskParams): Promise<KanbanTask> {
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
  
  // Update a task
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
  
  // Delete a task
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
  
  // Add a comment to a task
  async addComment(
    projectId: string, 
    taskId: string, 
    data: AddCommentParams
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
  
  // Add an attachment to a task
  async addAttachment(
    projectId: string,
    taskId: string,
    data: AddAttachmentParams
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

export const taskService = new TaskService();
