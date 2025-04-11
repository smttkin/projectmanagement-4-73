
import { ApiService } from '../base/ApiService';
import { Workspace } from '@/types/workspace';
import { Project } from '@/types/project';
import { toast } from 'sonner';
import { projectService } from '../project/projectService';
import { initialWorkspaces } from './types';

class WorkspaceService extends ApiService {
  private storageKey = 'workspaces_data';
  
  constructor() {
    super('workspaces');
    this.initializeStorage();
  }
  
  // Initialize local storage with mock data if empty
  private initializeStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(initialWorkspaces));
    }
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
  
  // Get all workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    try {
      const workspaces = this.getStoredWorkspaces();
      return this.simulateResponse(workspaces);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch workspaces');
    }
  }
  
  // Get a single workspace by ID
  async getWorkspace(id: string): Promise<Workspace | undefined> {
    try {
      const workspaces = this.getStoredWorkspaces();
      const workspace = workspaces.find(w => w.id === id);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${id} not found`);
      }
      
      return this.simulateResponse(workspace);
    } catch (error) {
      return this.handleError(error, `Failed to fetch workspace ${id}`);
    }
  }
  
  // Get all projects for a workspace
  async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
    try {
      const workspace = await this.getWorkspace(workspaceId);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }
      
      const allProjects = await projectService.getProjects();
      const workspaceProjects = allProjects.filter(project => 
        workspace.projects.includes(project.id)
      );
      
      return this.simulateResponse(workspaceProjects);
    } catch (error) {
      return this.handleError(error, `Failed to fetch projects for workspace ${workspaceId}`);
    }
  }
}

export const workspaceService = new WorkspaceService();
