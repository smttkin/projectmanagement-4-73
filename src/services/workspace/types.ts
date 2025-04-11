
import { Workspace } from '@/types/workspace';

// Sample workspace data
export const initialWorkspaces: Workspace[] = [
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
