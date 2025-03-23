
export type KanbanStatus = 'todo' | 'in-progress' | 'review' | 'done';

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
}

export interface KanbanWorksheet {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt: Date;
}
