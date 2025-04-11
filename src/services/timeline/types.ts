
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
