
import { 
  KanbanColumn, 
  KanbanTask, 
  KanbanWorksheet, 
  KanbanComment, 
  KanbanAttachment 
} from '@/types/kanban';

export interface CreateTaskParams extends Omit<KanbanTask, 'id' | 'createdAt' | 'projectId'> {}

export interface CreateWorksheetParams {
  title: string;
  description?: string;
}

export interface CreateColumnParams {
  title: string;
  color: string;
  worksheetId: string;
}

export interface AddCommentParams {
  content: string; 
  authorId: string; 
  authorName: string;
}

export interface AddAttachmentParams {
  name: string;
  url: string;
  type: string;
  size: number;
}
