
import { KanbanWorksheet } from '@/types/kanban';
import { toast } from 'sonner';
import { BaseKanbanService } from './baseKanbanService';
import { CreateWorksheetParams } from './types';

class WorksheetService extends BaseKanbanService {
  constructor() {
    super('kanban-worksheets');
  }
  
  // Get all worksheets for a project
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
  
  // Create a new worksheet for a project
  async createWorksheet(projectId: string, data: CreateWorksheetParams): Promise<KanbanWorksheet> {
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
}

export const worksheetService = new WorksheetService();
