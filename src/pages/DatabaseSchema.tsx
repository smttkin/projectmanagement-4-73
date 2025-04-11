import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Table2, 
  Key, 
  Link, 
  Users, 
  FileText, 
  Calendar, 
  LayoutList, 
  MessageSquare,
  Clock,
  Tag,
  GitBranch,
  Settings,
  Activity
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { teamService } from '@/services';

interface TableField {
  name: string;
  type: string;
  required: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  description?: string;
}

interface TableDefinition {
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: TableField[];
}

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

const DatabaseSchema = () => {
  const [activeTab, setActiveTab] = useState('schema');
  const [departments, setDepartments] = useState(departmentDefinitions);
  
  // Fetch department definitions if needed
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptDefs = await teamService.getDepartmentDefinitions();
        if (deptDefs && deptDefs.length > 0) {
          setDepartments(deptDefs);
        }
      } catch (error) {
        console.error("Error fetching department definitions:", error);
      }
    };
    
    fetchDepartments();
  }, []);
  
  const tables: TableDefinition[] = [
    {
      name: 'users',
      icon: <Users size={20} />,
      description: 'Stores user information and authentication details',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'name', type: 'text', required: true, description: 'Full name of the user' },
        { name: 'email', type: 'text', required: true, description: 'Email address (used for login)' },
        { name: 'avatar_url', type: 'text', required: false, description: 'URL to user profile image' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the user was created' },
        { name: 'role', type: 'text', required: true, description: 'User role (admin, user, etc.)' },
        { name: 'department_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'departments', description: 'Department the user belongs to' },
        { name: 'status', type: 'text', required: true, description: 'User status (active, away, offline)' },
        { name: 'bio', type: 'text', required: false, description: 'User biography' },
        { name: 'phone', type: 'text', required: false, description: 'Contact phone number' },
        { name: 'location', type: 'text', required: false, description: 'User location (city, country)' }
      ]
    },
    {
      name: 'departments',
      icon: <GitBranch size={20} />,
      description: 'Organization departments and teams',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'name', type: 'text', required: true, description: 'Department name' },
        { name: 'description', type: 'text', required: false, description: 'Department description' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the department was created' },
        { name: 'manager_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'users', description: 'Department manager' }
      ]
    },
    {
      name: 'projects',
      icon: <FileText size={20} />,
      description: 'Project details and metadata',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'title', type: 'text', required: true, description: 'Project title' },
        { name: 'description', type: 'text', required: false, description: 'Project description' },
        { name: 'status', type: 'text', required: true, description: 'Project status (active, completed, on-hold, cancelled)' },
        { name: 'priority', type: 'text', required: true, description: 'Project priority (low, medium, high)' },
        { name: 'progress', type: 'integer', required: true, description: 'Progress percentage (0-100)' },
        { name: 'start_date', type: 'timestamp', required: true, description: 'Project start date' },
        { name: 'due_date', type: 'timestamp', required: true, description: 'Project deadline' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the project was created' },
        { name: 'updated_at', type: 'timestamp', required: true, description: 'When the project was last updated' },
        { name: 'owner_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'Project owner' }
      ]
    },
    {
      name: 'project_members',
      icon: <Users size={20} />,
      description: 'Mapping between projects and team members',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'project_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'projects', description: 'Reference to project' },
        { name: 'user_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'Reference to team member' },
        { name: 'role', type: 'text', required: true, description: 'Role in the project' },
        { name: 'joined_at', type: 'timestamp', required: true, description: 'When the user joined the project' }
      ]
    },
    {
      name: 'tasks',
      icon: <LayoutList size={20} />,
      description: 'Project tasks and to-do items',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'title', type: 'text', required: true, description: 'Task title' },
        { name: 'description', type: 'text', required: false, description: 'Task description' },
        { name: 'status', type: 'text', required: true, description: 'Task status (todo, in-progress, review, done)' },
        { name: 'priority', type: 'text', required: true, description: 'Task priority (low, medium, high)' },
        { name: 'project_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'projects', description: 'Project the task belongs to' },
        { name: 'assignee_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'users', description: 'User assigned to the task' },
        { name: 'due_date', type: 'timestamp', required: false, description: 'Task due date' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the task was created' },
        { name: 'updated_at', type: 'timestamp', required: true, description: 'When the task was last updated' },
        { name: 'column_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'kanban_columns', description: 'Kanban column the task belongs to' }
      ]
    },
    {
      name: 'comments',
      icon: <MessageSquare size={20} />,
      description: 'Comments on tasks and projects',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'content', type: 'text', required: true, description: 'Comment content' },
        { name: 'user_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'User who created the comment' },
        { name: 'task_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'tasks', description: 'Task the comment is attached to' },
        { name: 'project_id', type: 'uuid', required: false, isForeign: true, foreignTable: 'projects', description: 'Project the comment is attached to' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the comment was created' },
        { name: 'updated_at', type: 'timestamp', required: true, description: 'When the comment was last updated' }
      ]
    },
    {
      name: 'kanban_boards',
      icon: <LayoutList size={20} />,
      description: 'Kanban boards for project task management',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'title', type: 'text', required: true, description: 'Board title' },
        { name: 'project_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'projects', description: 'Project the board belongs to' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the board was created' },
        { name: 'updated_at', type: 'timestamp', required: true, description: 'When the board was last updated' }
      ]
    },
    {
      name: 'kanban_columns',
      icon: <GitBranch size={20} />,
      description: 'Columns within Kanban boards',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'title', type: 'text', required: true, description: 'Column title' },
        { name: 'board_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'kanban_boards', description: 'Board the column belongs to' },
        { name: 'order', type: 'integer', required: true, description: 'Display order of the column' },
        { name: 'color', type: 'text', required: false, description: 'Column color' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the column was created' }
      ]
    },
    {
      name: 'time_entries',
      icon: <Clock size={20} />,
      description: 'Time tracking for tasks',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'task_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'tasks', description: 'Task being tracked' },
        { name: 'user_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'User tracking time' },
        { name: 'start_time', type: 'timestamp', required: true, description: 'When tracking started' },
        { name: 'end_time', type: 'timestamp', required: false, description: 'When tracking ended' },
        { name: 'duration', type: 'integer', required: false, description: 'Duration in seconds' },
        { name: 'description', type: 'text', required: false, description: 'Description of work done' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the entry was created' }
      ]
    },
    {
      name: 'tags',
      icon: <Tag size={20} />,
      description: 'Tags for projects and tasks',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'name', type: 'text', required: true, description: 'Tag name' },
        { name: 'color', type: 'text', required: false, description: 'Tag color' },
        { name: 'created_at', type: 'timestamp', required: true, description: 'When the tag was created' }
      ]
    },
    {
      name: 'item_tags',
      icon: <Link size={20} />,
      description: 'Mapping between tags and items (projects/tasks)',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'tag_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'tags', description: 'Reference to tag' },
        { name: 'item_id', type: 'uuid', required: true, description: 'ID of the tagged item' },
        { name: 'item_type', type: 'text', required: true, description: 'Type of item (project, task)' }
      ]
    },
    {
      name: 'activity_logs',
      icon: <Activity size={20} />,
      description: 'User activity logs',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'user_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'User who performed the action' },
        { name: 'action_type', type: 'text', required: true, description: 'Type of action performed' },
        { name: 'description', type: 'text', required: true, description: 'Description of the activity' },
        { name: 'related_id', type: 'uuid', required: false, description: 'ID of the related item' },
        { name: 'related_type', type: 'text', required: false, description: 'Type of the related item' },
        { name: 'occurred_at', type: 'timestamp', required: true, description: 'When the activity occurred' }
      ]
    },
    {
      name: 'team_invitations',
      icon: <Users size={20} />,
      description: 'Invitations to join the team',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'email', type: 'text', required: true, description: 'Email of the invited user' },
        { name: 'role', type: 'text', required: true, description: 'Role for the invited user' },
        { name: 'invited_by', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'User who sent the invitation' },
        { name: 'invited_at', type: 'timestamp', required: true, description: 'When the invitation was sent' },
        { name: 'status', type: 'text', required: true, description: 'Invitation status (pending, accepted, declined)' },
        { name: 'expires_at', type: 'timestamp', required: true, description: 'When the invitation expires' }
      ]
    },
    {
      name: 'user_settings',
      icon: <Settings size={20} />,
      description: 'User preferences and settings',
      fields: [
        { name: 'id', type: 'uuid', required: true, isPrimary: true, description: 'Primary identifier' },
        { name: 'user_id', type: 'uuid', required: true, isForeign: true, foreignTable: 'users', description: 'User the settings belong to' },
        { name: 'theme', type: 'text', required: false, description: 'UI theme preference' },
        { name: 'language', type: 'text', required: false, description: 'Language preference' },
        { name: 'notification_preferences', type: 'jsonb', required: false, description: 'Notification settings' },
        { name: 'timezone', type: 'text', required: false, description: 'User timezone' },
        { name: 'updated_at', type: 'timestamp', required: true, description: 'When settings were last updated' }
      ]
    }
  ];
  
  // Function to get field type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'uuid':
        return 'bg-purple-500';
      case 'text':
        return 'bg-blue-500';
      case 'integer':
        return 'bg-green-500';
      case 'timestamp':
        return 'bg-yellow-500';
      case 'jsonb':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6 space-x-2">
          <Database className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Database Schema</h1>
        </div>
        
        <Tabs defaultValue="schema" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="schema">
              <Table2 className="h-4 w-4 mr-2" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="relationships">
              <Link className="h-4 w-4 mr-2" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team Structure
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>
                  Complete database schema for the project management system
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tables.map((table) => (
                  <Card key={table.name} className="overflow-hidden border shadow-sm">
                    <CardHeader className="bg-muted/40 pb-3">
                      <div className="flex items-center space-x-2">
                        {table.icon}
                        <CardTitle className="text-lg">{table.name}</CardTitle>
                      </div>
                      <CardDescription>{table.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-sm">
                        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 px-6 py-3 bg-muted/20 font-medium text-muted-foreground">
                          <div>Field</div>
                          <div>Type</div>
                          <div>Required</div>
                        </div>
                        <Separator />
                        {table.fields.map((field, i) => (
                          <React.Fragment key={field.name}>
                            <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 px-6 py-3 hover:bg-muted/10">
                              <div className="flex items-center space-x-2">
                                {field.isPrimary && <Key className="h-3 w-3 text-yellow-500" />}
                                {field.isForeign && <Link className="h-3 w-3 text-blue-500" />}
                                <span className={field.isPrimary ? "font-semibold" : ""}>
                                  {field.name}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Badge className={`font-mono text-xs ${getTypeColor(field.type)} text-white`}>
                                  {field.type}
                                </Badge>
                                {field.foreignTable && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    → {field.foreignTable}
                                  </Badge>
                                )}
                              </div>
                              <div>
                                {field.required ? (
                                  <Badge variant="secondary">Required</Badge>
                                ) : (
                                  <Badge variant="outline">Optional</Badge>
                                )}
                              </div>
                            </div>
                            {i < table.fields.length - 1 && <Separator />}
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="relationships">
            <Card>
              <CardHeader>
                <CardTitle>Database Relationships</CardTitle>
                <CardDescription>
                  Table relationships and foreign key connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[600px] border rounded-md bg-muted/10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Database size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Relationship Diagram</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      In a real application, this would display an interactive entity relationship diagram showing all table connections.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Structure</CardTitle>
                <CardDescription>
                  Organization departments and role definitions
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {departments.map((dept) => (
                  <Card key={dept.name} className="overflow-hidden border shadow-sm">
                    <CardHeader className="bg-muted/40 pb-3">
                      <CardTitle className="text-lg">{dept.name} Department</CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Roles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dept.roles.map(role => (
                          <Badge key={role} variant="secondary">{role}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DatabaseSchema;
