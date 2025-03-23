
import { Project, TeamMember } from '@/types/project';
import { ProjectCardProps } from '@/components/ProjectCard';

/**
 * Converts a Project object to ProjectCardProps format
 */
export const projectToCardProps = (project: Project): ProjectCardProps => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    progress: project.progress,
    dueDate: project.dueDate,
    priority: project.priority,
    status: mapProjectStatusToCardStatus(project.status),
    members: project.teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar
    })),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    deadline: project.dueDate
  };
};

/**
 * Converts ProjectCardProps to Project format
 */
export const cardPropsToProject = (card: ProjectCardProps): Project => {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    progress: card.progress,
    dueDate: card.dueDate,
    priority: card.priority,
    status: mapCardStatusToProjectStatus(card.status),
    startDate: new Date().toISOString(), // Default if not provided
    teamMembers: card.members.map(member => ({
      id: member.id,
      name: member.name,
      email: `${member.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Generate email
      role: 'team member',
      avatar: member.avatar
    })),
    tags: [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString()
  };
};

/**
 * Maps Project status values to ProjectCard status values
 */
export const mapProjectStatusToCardStatus = (status: Project['status']): ProjectCardProps['status'] => {
  switch (status) {
    case 'active': return 'in-progress';
    case 'completed': return 'completed';
    case 'on-hold': return 'at-risk';
    case 'cancelled': return 'not-started';
    default: return 'not-started';
  }
};

/**
 * Maps ProjectCard status values to Project status values
 */
export const mapCardStatusToProjectStatus = (status: ProjectCardProps['status']): Project['status'] => {
  switch (status) {
    case 'in-progress': return 'active';
    case 'completed': return 'completed';
    case 'at-risk': return 'on-hold';
    case 'not-started': return 'cancelled';
    default: return 'active';
  }
};
