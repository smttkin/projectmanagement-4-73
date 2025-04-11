
import { Project } from './project';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  projects: string[]; // Array of project IDs
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  teamMembers?: string[]; // Optional array of team member IDs
}
