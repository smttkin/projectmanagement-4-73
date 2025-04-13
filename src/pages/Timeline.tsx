import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TimelineDisplay, { TimelineItem } from '@/components/TimelineDisplay';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CalendarDays,
  LayoutDashboard,
  FolderKanban,
  Kanban,
  Filter,
  PlusCircle,
  ListFilter
} from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { projectsData } from '@/data/projects';
import { KanbanWorksheet } from '@/types/kanban';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [availableWorksheets, setAvailableWorksheets] = useState<KanbanWorksheet[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    // Load worksheets for all projects
    const worksheets: KanbanWorksheet[] = [];
    
    projectsData.forEach(project => {
      const projectWorksheets = localStorage.getItem(`worksheets-${project.id}`);
      if (projectWorksheets) {
        try {
          const parsed = JSON.parse(projectWorksheets, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          });
          worksheets.push(...parsed);
        } catch (error) {
          console.error(`Error parsing worksheets for project ${project.id}:`, error);
        }
      }
    });
    
    setAvailableWorksheets(worksheets);
    
    // Generate timeline items based on projects and their deadlines
    const items: TimelineItem[] = projectsData.map(project => ({
      id: project.id,
      title: project.title,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      status: project.status as any,
      assignee: project.members[0]
    }));
    
    setTimelineItems(items);
  }, []);

  // Update timeline items when project or worksheet selection changes
  useEffect(() => {
    if (selectedProject) {
      // Filter worksheets by selected project
      const projectWorksheets = availableWorksheets.filter(
        ws => ws.projectId === selectedProject
      );
      
      // If there are worksheets, load kanban tasks
      if (projectWorksheets.length > 0) {
        const worksheetToUse = selectedWorksheet && 
          projectWorksheets.some(ws => ws.id === selectedWorksheet)
            ? selectedWorksheet
            : projectWorksheets[0].id;
            
        setSelectedWorksheet(worksheetToUse);
        
        // Load tasks for the selected worksheet
        const tasksData = localStorage.getItem(`kanban-tasks-${selectedProject}`);
        if (tasksData) {
          try {
            const allTasks = JSON.parse(tasksData, (key, value) => {
              if (key === 'createdAt') return new Date(value);
              return value;
            });
            
            // Convert Kanban tasks to timeline items
            const worksheetTasks = allTasks.filter((task: any) => 
              task.worksheetId === worksheetToUse
            );
            
            const items: TimelineItem[] = worksheetTasks.map((task: any) => {
              // Generate random end date based on status
              const startDate = task.createdAt;
              let endDate = new Date(startDate);
              
              if (task.status === 'in-progress') {
                endDate = addDays(startDate, 5 + Math.floor(Math.random() * 10));
              } else if (task.status === 'review') {
                endDate = addDays(startDate, 12 + Math.floor(Math.random() * 5));
              } else if (task.status === 'done') {
                endDate = addDays(startDate, 2 + Math.floor(Math.random() * 8));
              } else {
                endDate = addDays(startDate, 15 + Math.floor(Math.random() * 10));
              }
              
              return {
                id: task.id,
                title: task.title,
                startDate: startDate,
                endDate: endDate,
                status: mapKanbanStatusToTimelineStatus(task.status),
                assignee: task.assigneeId ? {
                  id: task.assigneeId,
                  name: 'Assigned User',
                  avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
                } : undefined
              };
            });
            
            setTimelineItems(items);
          } catch (error) {
            console.error('Error parsing Kanban tasks:', error);
          }
        }
      } else {
        // If no worksheets, show project as timeline items
        const project = projectsData.find(p => p.id === selectedProject);
        if (project) {
          const item: TimelineItem = {
            id: project.id,
            title: project.title,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
            status: project.status as any,
            assignee: project.members[0]
          };
          
          setTimelineItems([item]);
        }
      }
    } else {
      // Show all projects in timeline
      const items: TimelineItem[] = projectsData.map(project => ({
        id: project.id,
        title: project.title,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
        status: project.status as any,
        assignee: project.members[0]
      }));
      
      setTimelineItems(items);
    }
  }, [selectedProject, selectedWorksheet, availableWorksheets]);

  // Map Kanban status to timeline status
  const mapKanbanStatusToTimelineStatus = (
    kanbanStatus: string
  ): 'completed' | 'in-progress' | 'not-started' | 'at-risk' => {
    switch (kanbanStatus) {
      case 'done': return 'completed';
      case 'in-progress': return 'in-progress';
      case 'review': return 'in-progress';
      case 'todo': return 'not-started';
      default: return 'not-started';
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'week' | 'month' | 'quarter') => {
    setViewMode(mode);
    
    const now = new Date();
    
    if (mode === 'week') {
      setStartDate(now);
      setEndDate(addDays(now, 7));
    } else if (mode === 'month') {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    } else if (mode === 'quarter') {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(addMonths(now, 2)));
    }
  };

  // Navigation buttons
  const handlePrevious = () => {
    if (viewMode === 'week') {
      setStartDate(prev => addDays(prev, -7));
      setEndDate(prev => addDays(prev, -7));
    } else if (viewMode === 'month') {
      setStartDate(prev => startOfMonth(subMonths(prev, 1)));
      setEndDate(prev => endOfMonth(subMonths(prev, 1)));
    } else if (viewMode === 'quarter') {
      setStartDate(prev => startOfMonth(subMonths(prev, 3)));
      setEndDate(prev => endOfMonth(subMonths(prev, 1)));
    }
  };
  
  const handleNext = () => {
    if (viewMode === 'week') {
      setStartDate(prev => addDays(prev, 7));
      setEndDate(prev => addDays(prev, 7));
    } else if (viewMode === 'month') {
      setStartDate(prev => startOfMonth(addMonths(prev, 1)));
      setEndDate(prev => endOfMonth(addMonths(prev, 1)));
    } else if (viewMode === 'quarter') {
      setStartDate(prev => startOfMonth(addMonths(prev, 3)));
      setEndDate(prev => endOfMonth(addMonths(prev, 5)));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Project Timeline
          </h1>
          <p className="text-muted-foreground">Visualize project tasks and milestones on a timeline.</p>
        </div>
        
        {/* Controls */}
        <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6 transition-all hover:shadow-md">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between bg-gradient-to-r from-background to-muted/20">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevious}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium">
                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNext}
                className="ml-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('week')}
                  className="transition-all"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Week
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('month')}
                  className="transition-all"
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Month
                </Button>
                <Button
                  variant={viewMode === 'quarter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('quarter')}
                  className="transition-all"
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Quarter
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full sm:w-auto">
                <Label htmlFor="projectFilter" className="text-xs mb-1 block">Project</Label>
                <Select
                  value={selectedProject || "all"}
                  onValueChange={(value) => {
                    setSelectedProject(value === "all" ? null : value);
                    setSelectedWorksheet(null);
                  }}
                >
                  <SelectTrigger id="projectFilter" className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projectsData.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProject && availableWorksheets.filter(ws => ws.projectId === selectedProject).length > 0 && (
                <div className="w-full sm:w-auto">
                  <Label htmlFor="worksheetFilter" className="text-xs mb-1 block">Kanban Board</Label>
                  <Select
                    value={selectedWorksheet || "none"}
                    onValueChange={(value) => setSelectedWorksheet(value === "none" ? null : value)}
                  >
                    <SelectTrigger id="worksheetFilter" className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select a Board</SelectItem>
                      {availableWorksheets
                        .filter(ws => ws.projectId === selectedProject)
                        .map(worksheet => (
                          <SelectItem key={worksheet.id} value={worksheet.id}>
                            <div className="flex items-center">
                              <Kanban className="h-4 w-4 mr-2" />
                              {worksheet.title}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-auto ml-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <ListFilter className="h-3.5 w-3.5 mr-1" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Filter by Status</h3>
                      <div className="flex flex-wrap gap-1">
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          Completed
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                          In Progress
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                          Not Started
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                          At Risk
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {selectedProject && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => navigate(`/project/${selectedProject}`)}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                    View Project
                  </Button>
                )}
                
                {selectedProject && selectedWorksheet && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => navigate(`/project/${selectedProject}`, { 
                      state: { openKanban: true, worksheetId: selectedWorksheet } 
                    })}
                  >
                    <FolderKanban className="h-3.5 w-3.5 mr-1" />
                    Open Kanban
                  </Button>
                )}
                
                <Button variant="default" size="sm" className="h-8">
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  Add Event
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6 transition-all hover:shadow-md">
          <div className="p-4 border-b border-border bg-gradient-to-r from-background to-muted/20">
            <h2 className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Timeline View
            </h2>
          </div>
          
          <div className="p-4">
            {timelineItems.length > 0 ? (
              <TimelineDisplay 
                items={timelineItems} 
                startDate={startDate}
                endDate={endDate}
                viewMode={viewMode}
              />
            ) : (
              <div className="text-center py-12 bg-muted/5 rounded-lg border border-dashed border-muted-foreground/20">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No timeline items to display for the selected project or worksheet.
                </p>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Timeline;
