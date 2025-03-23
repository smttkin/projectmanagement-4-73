
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  startDate: string;
  dueDate: string;
  teamMembers: TeamMember[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assigneeId?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdAt: Date;
}
