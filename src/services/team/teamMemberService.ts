
import { ApiService } from '../base/ApiService';
import { UserData, TeamMemberOverview } from '@/types/user';
import { toast } from 'sonner';
import { mockTeamMembers, mockActivityLogs } from './mockData';

class TeamMemberService extends ApiService {
  constructor() {
    super('team-members');
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
}

export const teamMemberService = new TeamMemberService();
