
import { ApiService } from '../base/ApiService';
import { ActivityLogItem } from '@/types/user';
import { mockActivityLogs } from './mockData';

class TeamActivityService extends ApiService {
  constructor() {
    super('team-activity');
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
}

export const teamActivityService = new TeamActivityService();
