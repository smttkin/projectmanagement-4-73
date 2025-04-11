
import { ApiService } from './api';
import { Workspace } from '@/types/workspace';
import { Project } from '@/types/project';
import { toast } from 'sonner';
import { projectService } from './projectService';

// Sample workspace data
const initialWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Marketing',
    description: 'All marketing related projects and campaigns',
    projects: ['project-1', 'project-3'],
    color: '#4f46e5',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: 'ws-2',
    name: 'Development',
    description: 'Software development and engineering projects',
    projects: ['project-2', 'project-4'],
    color: '#0891b2',
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: 'ws-3',
    name: 'Personal',
    description: 'Personal projects and tasks',
    projects: ['project-5'],
    color: '#65a30d',
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString(),
  }
];

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
  
  // Add a project to a workspace
  async addProjectToWorkspace(workspaceId: string, projectId: string): Promise<Workspace> {
    try {
      const workspace = await this.getWorkspace(workspaceId);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }
      
      // Check if project already exists in workspace
      if (workspace.projects.includes(projectId)) {
        return workspace;
      }
      
      // Add project to workspace
      const updatedWorkspace = await this.updateWorkspace(workspaceId, {
        projects: [...workspace.projects, projectId]
      });
      
      toast.success('Project added to workspace');
      return updatedWorkspace;
    } catch (error) {
      return this.handleError(error, `Failed to add project to workspace ${workspaceId}`);
    }
  }
  
  // Remove a project from a workspace
  async removeProjectFromWorkspace(workspaceId: string, projectId: string): Promise<Workspace> {
    try {
      const workspace = await this.getWorkspace(workspaceId);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }
      
      // Remove project from workspace
      const updatedWorkspace = await this.updateWorkspace(workspaceId, {
        projects: workspace.projects.filter(id => id !== projectId)
      });
      
      toast.success('Project removed from workspace');
      return updatedWorkspace;
    } catch (error) {
      return this.handleError(error, `Failed to remove project from workspace ${workspaceId}`);
    }
  }
}

export const workspaceService = new WorkspaceService();
