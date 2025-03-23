
import { ApiService } from './api';
import { UserData, TeamMemberOverview, ActivityLogItem, TeamInvitation } from '@/types/user';
import { toast } from 'sonner';

// Mock team members data
const mockTeamMembers: TeamMemberOverview[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Product Manager',
    department: 'Product',
    status: 'active',
    workload: 85,
    assignedTasks: 12,
    currentProject: 'Website Redesign'
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'UX Designer',
    department: 'Design',
    status: 'active',
    workload: 60,
    assignedTasks: 8,
    currentProject: 'Mobile App Development'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'Frontend Developer',
    department: 'Engineering',
    status: 'away',
    workload: 90,
    assignedTasks: 15,
    currentProject: 'Website Redesign'
  },
  {
    id: '4',
    name: 'Jessica Taylor',
    email: 'jessica@example.com',
    avatar: 'https://i.pravatar.cc/150?img=9',
    role: 'Backend Developer',
    department: 'Engineering',
    status: 'active',
    workload: 75,
    assignedTasks: 10,
    currentProject: 'API Integration'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    status: 'offline',
    workload: 50,
    assignedTasks: 7,
    currentProject: 'Website Redesign'
  }
];

// Mock activity logs
const mockActivityLogs: Record<string, ActivityLogItem[]> = {
  '1': [
    {
      id: 'a1',
      type: 'project_update',
      content: 'Updated project timeline for Website Redesign',
      timestamp: '2023-08-15T14:30:00Z',
      relatedId: 'p1',
      relatedType: 'project'
    },
    {
      id: 'a2',
      type: 'task_complete',
      content: 'Completed wireframe design for homepage',
      timestamp: '2023-08-14T16:45:00Z',
      relatedId: 't1',
      relatedType: 'task'
    }
  ],
  '2': [
    {
      id: 'a3',
      type: 'comment',
      content: 'Left feedback on mobile navigation design',
      timestamp: '2023-08-15T11:20:00Z',
      relatedId: 't2',
      relatedType: 'task'
    }
  ]
};

// Mock pending invitations
const mockInvitations: TeamInvitation[] = [
  {
    id: 'inv1',
    email: 'mark@example.com',
    role: 'Frontend Developer',
    invitedBy: '1',
    invitedAt: '2023-08-10T09:30:00Z',
    status: 'pending',
    expiresAt: '2023-08-17T09:30:00Z'
  },
  {
    id: 'inv2',
    email: 'lisa@example.com',
    role: 'Product Designer',
    invitedBy: '1',
    invitedAt: '2023-08-12T14:15:00Z',
    status: 'accepted',
    expiresAt: '2023-08-19T14:15:00Z'
  }
];

// Department definitions
const departmentDefinitions = [
  {
    name: 'Engineering',
    description: 'Responsible for software development, infrastructure, and technical implementation.',
    roles: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Mobile Developer', 'Tech Lead']
  },
  {
    name: 'Design',
    description: 'Creates user interfaces, user experiences, and visual assets for products.',
    roles: ['UX Designer', 'UI Designer', 'Graphic Designer', 'Product Designer', 'Design Lead']
  },
  {
    name: 'Product',
    description: 'Defines product strategy, requirements, and roadmaps.',
    roles: ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Strategist']
  },
  {
    name: 'Quality Assurance',
    description: 'Ensures software quality through testing and quality control processes.',
    roles: ['QA Engineer', 'Test Automation Engineer', 'QA Lead', 'Quality Analyst']
  },
  {
    name: 'Marketing',
    description: 'Develops and executes marketing strategies to promote products.',
    roles: ['Marketing Specialist', 'Content Writer', 'SEO Specialist', 'Social Media Manager']
  }
];

class TeamService extends ApiService {
  constructor() {
    super('team');
  }

  /**
   * Get all team members
   */
  async getAllTeamMembers(): Promise<TeamMemberOverview[]> {
    try {
      await this.delay();
      return mockTeamMembers;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch team members');
    }
  }

  /**
   * Get team member by ID
   */
  async getTeamMemberById(id: string): Promise<UserData | null> {
    try {
      await this.delay();
      const member = mockTeamMembers.find(m => m.id === id);
      
      if (!member) {
        return null;
      }
      
      // Convert TeamMemberOverview to UserData
      return {
        ...member,
        activityLog: mockActivityLogs[id] || []
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch team member');
    }
  }

  /**
   * Update team member
   */
  async updateTeamMember(id: string, updates: Partial<UserData>): Promise<UserData> {
    try {
      await this.delay();
      
      // Find the member index
      const memberIndex = mockTeamMembers.findIndex(m => m.id === id);
      
      if (memberIndex === -1) {
        throw new Error('Team member not found');
      }
      
      // Update the member data
      const updatedMember = {
        ...mockTeamMembers[memberIndex],
        ...updates
      };
      
      mockTeamMembers[memberIndex] = updatedMember as TeamMemberOverview;
      
      toast.success('Team member updated successfully');
      
      return {
        ...updatedMember,
        activityLog: mockActivityLogs[id] || []
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update team member');
    }
  }

  /**
   * Add new team member
   */
  async addTeamMember(data: Omit<TeamMemberOverview, 'id'>): Promise<TeamMemberOverview> {
    try {
      await this.delay();
      
      const newMember: TeamMemberOverview = {
        id: `tm-${Date.now()}`,
        ...data
      };
      
      mockTeamMembers.push(newMember);
      
      toast.success('Team member added successfully');
      
      return newMember;
    } catch (error) {
      return this.handleError(error, 'Failed to add team member');
    }
  }

  /**
   * Remove team member
   */
  async removeTeamMember(id: string): Promise<boolean> {
    try {
      await this.delay();
      
      const index = mockTeamMembers.findIndex(m => m.id === id);
      
      if (index === -1) {
        throw new Error('Team member not found');
      }
      
      mockTeamMembers.splice(index, 1);
      
      toast.success('Team member removed successfully');
      
      return true;
    } catch (error) {
      this.handleError(error, 'Failed to remove team member');
      return false;
    }
  }

  /**
   * Get team member activity
   */
  async getTeamMemberActivity(id: string): Promise<ActivityLogItem[]> {
    try {
      await this.delay();
      return mockActivityLogs[id] || [];
    } catch (error) {
      return this.handleError(error, 'Failed to fetch activity log');
    }
  }

  /**
   * Add activity log entry
   */
  async addActivityLogEntry(userId: string, activity: Omit<ActivityLogItem, 'id' | 'timestamp'>): Promise<ActivityLogItem> {
    try {
      await this.delay();
      
      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...activity
      };
      
      if (!mockActivityLogs[userId]) {
        mockActivityLogs[userId] = [];
      }
      
      mockActivityLogs[userId].unshift(newActivity);
      
      return newActivity;
    } catch (error) {
      return this.handleError(error, 'Failed to add activity log');
    }
  }

  /**
   * Get pending invitations
   */
  async getPendingInvitations(): Promise<TeamInvitation[]> {
    try {
      await this.delay();
      return mockInvitations.filter(inv => inv.status === 'pending');
    } catch (error) {
      return this.handleError(error, 'Failed to fetch pending invitations');
    }
  }

  /**
   * Send team invitation
   */
  async sendInvitation(invitation: Omit<TeamInvitation, 'id' | 'invitedAt' | 'status' | 'expiresAt'>): Promise<TeamInvitation> {
    try {
      await this.delay();
      
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + 7); // Expires in 7 days
      
      const newInvitation: TeamInvitation = {
        id: `inv-${Date.now()}`,
        invitedAt: now.toISOString(),
        status: 'pending',
        expiresAt: expiresAt.toISOString(),
        ...invitation
      };
      
      mockInvitations.push(newInvitation);
      
      toast.success('Invitation sent successfully');
      
      return newInvitation;
    } catch (error) {
      return this.handleError(error, 'Failed to send invitation');
    }
  }

  /**
   * Update invitation status
   */
  async updateInvitationStatus(id: string, status: 'accepted' | 'declined'): Promise<TeamInvitation> {
    try {
      await this.delay();
      
      const invIndex = mockInvitations.findIndex(inv => inv.id === id);
      
      if (invIndex === -1) {
        throw new Error('Invitation not found');
      }
      
      mockInvitations[invIndex].status = status;
      
      toast.success(`Invitation ${status}`);
      
      return mockInvitations[invIndex];
    } catch (error) {
      return this.handleError(error, 'Failed to update invitation');
    }
  }

  /**
   * Get department definitions
   */
  async getDepartmentDefinitions() {
    try {
      await this.delay(200); // Short delay
      return departmentDefinitions;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch department definitions');
    }
  }
}

export const teamService = new TeamService();
