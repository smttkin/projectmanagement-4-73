
export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'away' | 'offline';
  skills?: string[];
  bio?: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  activityLog?: ActivityLogItem[];
}

export interface ActivityLogItem {
  id: string;
  type: 'project_update' | 'task_complete' | 'comment' | 'status_change' | 'mention';
  content: string;
  timestamp: string;
  relatedId?: string;
  relatedType?: 'project' | 'task' | 'comment';
}

export interface TeamMemberOverview {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  status: 'active' | 'away' | 'offline';
  workload?: number; // Percentage of capacity
  assignedTasks?: number;
  currentProject?: string;
}

export type TeamInvitation = {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: string;
};
