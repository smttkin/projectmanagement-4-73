
import { ApiService } from '../base/ApiService';
import { Workspace } from '@/types/workspace';
import { Project } from '@/types/project';
import { toast } from 'sonner';
import { workspaceService } from './workspaceService';
import { projectService } from '../project/projectService';

class WorkspaceProjectService extends ApiService {
  private storageKey = 'workspaces_data';
  
  constructor() {
    super('workspace-projects');
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
  
  // Add a project to a workspace
  async addProjectToWorkspace(workspaceId: string, projectId: string): Promise<Workspace> {
    try {
      const workspace = await workspaceService.getWorkspace(workspaceId);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }
      
      // Check if project already exists in workspace
      if (workspace.projects.includes(projectId)) {
        return workspace;
      }
      
      // Get all workspaces
      const workspaces = this.getStoredWorkspaces();
      const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
      
      // Update workspace with new project
      const updatedWorkspace = {
        ...workspaces[workspaceIndex],
        projects: [...workspaces[workspaceIndex].projects, projectId],
        updatedAt: new Date().toISOString()
      };
      
      workspaces[workspaceIndex] = updatedWorkspace;
      this.saveWorkspaces(workspaces);
      
      toast.success('Project added to workspace');
      return this.simulateResponse(updatedWorkspace);
    } catch (error) {
      return this.handleError(error, `Failed to add project to workspace ${workspaceId}`);
    }
  }

  // Add a new project and add it to workspace
  async addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { workspaceId: string }): Promise<Project> {
    try {
      const { workspaceId, ...projectDetails } = projectData;
      
      // Create the project first
      const newProject = await projectService.createProject(projectDetails);
      
      // Then add it to the workspace
      await this.addProjectToWorkspace(workspaceId, newProject.id);
      
      toast.success('Project created and added to workspace');
      return newProject;
    } catch (error) {
      return this.handleError(error, 'Failed to create project');
    }
  }
  
  // Remove a project from a workspace
  async removeProjectFromWorkspace(workspaceId: string, projectId: string): Promise<Workspace> {
    try {
      const workspace = await workspaceService.getWorkspace(workspaceId);
      
      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }
      
      // Get all workspaces
      const workspaces = this.getStoredWorkspaces();
      const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
      
      // Update workspace to remove project
      const updatedWorkspace = {
        ...workspaces[workspaceIndex],
        projects: workspaces[workspaceIndex].projects.filter(id => id !== projectId),
        updatedAt: new Date().toISOString()
      };
      
      workspaces[workspaceIndex] = updatedWorkspace;
      this.saveWorkspaces(workspaces);
      
      toast.success('Project removed from workspace');
      return this.simulateResponse(updatedWorkspace);
    } catch (error) {
      return this.handleError(error, `Failed to remove project from workspace ${workspaceId}`);
    }
  }
}

export const workspaceProjectService = new WorkspaceProjectService();
