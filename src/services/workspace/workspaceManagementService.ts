
import { ApiService } from '../base/ApiService';
import { Workspace } from '@/types/workspace';
import { toast } from 'sonner';
import { workspaceService } from './workspaceService';

class WorkspaceManagementService extends ApiService {
  private storageKey = 'workspaces_data';
  
  constructor() {
    super('workspace-management');
  }
  
  // Get workspaces from local storage
  private getStoredWorkspaces(): Workspace[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Save workspaces to local storage
  private saveWorkspaces(workspaces: Workspace[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(workspaces));
  }
  
  // Create a new workspace
  async createWorkspace(workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
    try {
      // Create new workspace with generated ID and timestamps
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        ...workspaceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to storage
      const workspaces = this.getStoredWorkspaces();
      this.saveWorkspaces([...workspaces, newWorkspace]);
      
      toast.success('Workspace created successfully');
      return this.simulateResponse(newWorkspace);
    } catch (error) {
      return this.handleError(error, 'Failed to create workspace');
    }
  }
  
  // Update an existing workspace
  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
    try {
      const workspaces = this.getStoredWorkspaces();
      const workspaceIndex = workspaces.findIndex(w => w.id === id);
      
      if (workspaceIndex === -1) {
        throw new Error(`Workspace with ID ${id} not found`);
      }
      
      // Update the workspace
      const updatedWorkspace = {
        ...workspaces[workspaceIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      workspaces[workspaceIndex] = updatedWorkspace;
      this.saveWorkspaces(workspaces);
      
      toast.success('Workspace updated successfully');
      return this.simulateResponse(updatedWorkspace);
    } catch (error) {
      return this.handleError(error, `Failed to update workspace ${id}`);
    }
  }
  
  // Delete a workspace
  async deleteWorkspace(id: string): Promise<void> {
    try {
      const workspaces = this.getStoredWorkspaces();
      const updatedWorkspaces = workspaces.filter(w => w.id !== id);
      
      if (workspaces.length === updatedWorkspaces.length) {
        throw new Error(`Workspace with ID ${id} not found`);
      }
      
      this.saveWorkspaces(updatedWorkspaces);
      
      await this.simulateResponse(undefined);
      toast.success('Workspace deleted successfully');
    } catch (error) {
      this.handleError(error, `Failed to delete workspace ${id}`);
    }
  }
}

export const workspaceManagementService = new WorkspaceManagementService();
