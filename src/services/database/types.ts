
// Define the interface for table fields
export interface TableField {
  name: string;
  type: string;
  required: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  description?: string;
}

// Define the interface for table definitions
export interface TableDefinition {
  name: string;
  icon?: React.ReactNode;
  description: string;
  fields: TableField[];
}

// Define the interface for department definitions
export interface DepartmentDefinition {
  name: string;
  description: string;
  roles: string[];
}

// Mock departmentDefinitions data
export const departmentDefinitions: DepartmentDefinition[] = [
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
