
import { ApiService } from '../base/ApiService';
import { TeamInvitation } from '@/types/user';
import { toast } from 'sonner';
import { mockInvitations } from './mockData';

class TeamInvitationService extends ApiService {
  constructor() {
    super('team-invitations');
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
}

export const teamInvitationService = new TeamInvitationService();
