
import { KanbanColumn } from '@/types/kanban';
import { toast } from 'sonner';
import { BaseKanbanService } from './baseKanbanService';
import { CreateColumnParams } from './types';

class ColumnService extends BaseKanbanService {
  constructor() {
    super('kanban-columns');
  }
  
  // Get all columns for a worksheet
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
  
  // Create a new column
  async createColumn(projectId: string, data: CreateColumnParams): Promise<KanbanColumn> {
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
  
  // Update a column
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
  
  // Delete a column
  async deleteColumn(projectId: string, columnId: string): Promise<void> {
    try {
      const columns = this.getData<KanbanColumn>(projectId, 'kanban-columns');
      const tasks = this.getData<any>(projectId, 'kanban-tasks');
      
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
      const updatedTasks = tasks.map((task: any) => 
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
}

export const columnService = new ColumnService();
