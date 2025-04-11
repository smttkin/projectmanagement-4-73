
import { TeamMemberOverview, ActivityLogItem, TeamInvitation } from '@/types/user';

// Mock team members data
export const mockTeamMembers: TeamMemberOverview[] = [
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
export const mockActivityLogs: Record<string, ActivityLogItem[]> = {
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
export const mockInvitations: TeamInvitation[] = [
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
export const departmentDefinitions = [
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
