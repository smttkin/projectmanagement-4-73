
import { ApiService } from './api';
import { toast } from 'sonner';

export interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'in-progress' | 'completed' | 'delayed';
  category: string;
  assigneeIds?: string[];
}

class TimelineService extends ApiService {
  private storageKey = 'timeline_events';
  
  constructor() {
    super('timeline');
    this.initializeStorage();
  }
  
  private initializeStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      const sampleEvents: TimelineEvent[] = [
        {
          id: 'evt-1',
          projectId: '1',
          title: 'Project Kickoff',
          description: 'Initial meeting with stakeholders',
          startDate: new Date(2025, 2, 1),
          endDate: new Date(2025, 2, 1),
          status: 'completed',
          category: 'meeting'
        },
        {
          id: 'evt-2',
          projectId: '1',
          title: 'Design Phase',
          description: 'UI/UX design and prototyping',
          startDate: new Date(2025, 2, 3),
          endDate: new Date(2025, 2, 15),
          status: 'in-progress',
          category: 'design'
        },
        {
          id: 'evt-3',
          projectId: '1',
          title: 'Development Sprint 1',
          description: 'Core functionality implementation',
          startDate: new Date(2025, 2, 16),
          endDate: new Date(2025, 2, 30),
          status: 'upcoming',
          category: 'development'
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sampleEvents));
    }
  }
  
  private getEvents(): TimelineEvent[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'startDate' || key === 'endDate') return new Date(value);
      return value;
    }) : [];
  }
  
  private saveEvents(events: TimelineEvent[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }
  
  async getProjectEvents(projectId: string): Promise<TimelineEvent[]> {
    try {
      const allEvents = this.getEvents();
      const projectEvents = allEvents.filter(event => event.projectId === projectId);
      
      return this.simulateResponse(projectEvents);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch timeline events');
    }
  }
  
  async createEvent(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
    try {
      const allEvents = this.getEvents();
      
      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        ...event
      };
      
      this.saveEvents([...allEvents, newEvent]);
      
      toast.success('Event added to timeline');
      return this.simulateResponse(newEvent);
    } catch (error) {
      return this.handleError(error, 'Failed to create timeline event');
    }
  }
  
  async updateEvent(id: string, updates: Partial<TimelineEvent>): Promise<TimelineEvent> {
    try {
      const allEvents = this.getEvents();
      const eventIndex = allEvents.findIndex(e => e.id === id);
      
      if (eventIndex === -1) {
        throw new Error('Timeline event not found');
      }
      
      const updatedEvent = {
        ...allEvents[eventIndex],
        ...updates
      };
      
      allEvents[eventIndex] = updatedEvent;
      this.saveEvents(allEvents);
      
      toast.success('Timeline event updated');
      return this.simulateResponse(updatedEvent);
    } catch (error) {
      return this.handleError(error, 'Failed to update timeline event');
    }
  }
  
  async deleteEvent(id: string): Promise<void> {
    try {
      const allEvents = this.getEvents();
      const updatedEvents = allEvents.filter(e => e.id !== id);
      
      if (allEvents.length === updatedEvents.length) {
        throw new Error('Timeline event not found');
      }
      
      this.saveEvents(updatedEvents);
      
      toast.success('Timeline event removed');
      return this.simulateResponse(undefined);
    } catch (error) {
      this.handleError(error, 'Failed to delete timeline event');
    }
  }
}

export const timelineService = new TimelineService();
