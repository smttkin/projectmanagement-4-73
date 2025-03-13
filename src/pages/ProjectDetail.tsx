
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Save, 
  Trash2, 
  Users 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ProjectCardProps } from '@/components/ProjectCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importing mock data to find the project
import { projectsData } from '@/data/projects';

interface ProjectDetailProps {
  edit?: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ edit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(edit);
  const [project, setProject] = useState<ProjectCardProps | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const foundProject = projectsData.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
      setFormData({
        title: foundProject.title,
        description: foundProject.description,
        status: foundProject.status,
        priority: foundProject.priority,
        dueDate: foundProject.dueDate,
      });
    } else {
      toast.error("Project not found");
      navigate('/dashboard');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    toast.success("Project updated successfully", {
      description: "All changes have been saved.",
    });
    setIsEditing(false);
    
    // Update the local state to reflect changes
    if (project) {
      setProject({
        ...project,
        title: formData.title,
        description: formData.description,
        status: formData.status as any,
        priority: formData.priority as any,
        dueDate: formData.dueDate,
      });
    }
  };

  const handleDelete = () => {
    toast.success("Project deleted", {
      description: "The project has been removed.",
    });
    navigate('/dashboard');
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            {isEditing ? (
              <div className="flex-1 mr-4">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-2xl font-bold mb-2"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold">{project.title}</h1>
            )}
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} variant="success">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Project Details</h2>
              </div>
              
              <div className="p-5">
                {isEditing ? (
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[120px] mb-4"
                  />
                ) : (
                  <p className="text-muted-foreground mb-6">{project.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                    {isEditing ? (
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${
                          project.status === 'completed' ? 'bg-green-500' :
                          project.status === 'in-progress' ? 'bg-blue-500' :
                          project.status === 'not-started' ? 'bg-orange-500' :
                          'bg-red-500'
                        } mr-2`}></div>
                        <span className="capitalize">{project.status.replace('-', ' ')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
                    {isEditing ? (
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => handleSelectChange('priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="capitalize">{project.priority}</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        placeholder="e.g. Sep 30"
                      />
                    ) : (
                      <span>{project.dueDate}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Progress</h2>
              </div>
              
              <div className="p-5">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium">{project.progress}% Complete</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Team Members</h2>
              </div>
              
              <div className="p-5">
                <ul className="space-y-3">
                  {project.members.map(member => (
                    <li key={member.id} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-muted mr-3 overflow-hidden flex items-center justify-center">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span>{member.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              
              <div className="p-5">
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Track Time
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
