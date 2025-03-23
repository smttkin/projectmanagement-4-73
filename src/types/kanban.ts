
export type KanbanStatus = string;

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  order: number;
  worksheetId: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: KanbanStatus;
  assigneeId?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  projectId: string;
  worksheetId: string;
  comments?: KanbanComment[];
  attachments?: KanbanAttachment[];
}

export interface KanbanComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  taskId: string;
  replies?: KanbanComment[];
}

export interface KanbanAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  taskId: string;
  createdAt: Date;
}

export interface KanbanWorksheet {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt: Date;
  columns?: KanbanColumn[];
}
