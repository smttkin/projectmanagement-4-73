
import { ApiService } from '../base/ApiService';
import { Project } from '@/types/project';
import { toast } from 'sonner';

// Import sample project data
import { projectsData } from '@/data/projects';

class ProjectService extends ApiService {
  private storageKey = 'projects_data';
  
  constructor() {
    super('projects');
    this.initializeStorage();
  }
  
  // Initialize local storage with mock data if empty
  private initializeStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(projectsData));
    }
  }
  
  // Get projects from local storage
  private getStoredProjects(): Project[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Save projects to local storage
  private saveProjects(projects: Project[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }
  
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const projects = this.getStoredProjects();
      return this.simulateResponse(projects);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch projects');
    }
  }
  
  // Get a single project by ID
  async getProject(id: string): Promise<Project | undefined> {
    try {
      const projects = this.getStoredProjects();
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        throw new Error(`Project with ID ${id} not found`);
      }
      
      return this.simulateResponse(project);
    } catch (error) {
      return this.handleError(error, `Failed to fetch project ${id}`);
    }
  }
  
  // Create a new project
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      // Create new project with generated ID and timestamps
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to storage
      const projects = this.getStoredProjects();
      this.saveProjects([...projects, newProject]);
      
      toast.success('Project created successfully');
      return this.simulateResponse(newProject, 0.1);
    } catch (error) {
      return this.handleError(error, 'Failed to create project');
    }
  }
  
  // Update an existing project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const projects = this.getStoredProjects();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw new Error(`Project with ID ${id} not found`);
      }
      
      // Update the project
      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      projects[projectIndex] = updatedProject;
      this.saveProjects(projects);
      
      toast.success('Project updated successfully');
      return this.simulateResponse(updatedProject);
    } catch (error) {
      return this.handleError(error, `Failed to update project ${id}`);
    }
  }
  
  // Delete a project
  async deleteProject(id: string): Promise<void> {
    try {
      const projects = this.getStoredProjects();
      const updatedProjects = projects.filter(p => p.id !== id);
      
      if (projects.length === updatedProjects.length) {
        throw new Error(`Project with ID ${id} not found`);
      }
      
      this.saveProjects(updatedProjects);
      
      await this.simulateResponse(undefined);
      toast.success('Project deleted successfully');
    } catch (error) {
      this.handleError(error, `Failed to delete project ${id}`);
    }
  }
}

export const projectService = new ProjectService();
