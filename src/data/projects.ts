
import { ProjectCardProps } from '@/components/ProjectCard';

// Mock data for projects
export const projectsData: ProjectCardProps[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding and improved UX.',
    progress: 65,
    dueDate: 'Sep 30',
    priority: 'high',
    status: 'in-progress',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
    ],
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile application for iOS and Android.',
    progress: 30,
    dueDate: 'Oct 15',
    priority: 'medium',
    status: 'in-progress',
    members: [
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '4', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Launch Q4 marketing campaign across social media channels.',
    progress: 100,
    dueDate: 'Aug 28',
    priority: 'medium',
    status: 'completed',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
      { id: '5', name: 'Robert Johnson', avatar: 'https://i.pravatar.cc/150?img=59' },
      { id: '6', name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?img=24' },
    ],
  },
  {
    id: '4',
    title: 'Product Launch',
    description: 'Coordinate and execute launch of new product line.',
    progress: 10,
    dueDate: 'Nov 5',
    priority: 'high',
    status: 'not-started',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '4', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
  },
  {
    id: '5',
    title: 'Customer Feedback Survey',
    description: 'Design and distribute customer satisfaction survey.',
    progress: 90,
    dueDate: 'Sep 10',
    priority: 'low',
    status: 'in-progress',
    members: [
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
    ],
  },
  {
    id: '6',
    title: 'System Integration',
    description: 'Integrate new CRM system with existing infrastructure.',
    progress: 45,
    dueDate: 'Oct 25',
    priority: 'high',
    status: 'at-risk',
    members: [
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '5', name: 'Robert Johnson', avatar: 'https://i.pravatar.cc/150?img=59' },
      { id: '7', name: 'Mark Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
  },
];
