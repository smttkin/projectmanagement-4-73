import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { KanbanTask, KanbanStatus, KanbanWorksheet } from '@/types/kanban';
import { Button } from '@/components/ui/button';
import { Plus, Layout, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { useKanban } from '@/hooks/useKanban';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const {
    worksheets,
    currentWorksheet,
    setCurrentWorksheet,
    createWorksheet,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus
  } = useKanban(projectId);
  
  const tasksByStatus = getTasksByStatus();
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateWorksheetOpen, setIsCreateWorksheetOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<KanbanStatus>('todo');
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as KanbanStatus,
    priority: 'medium' as KanbanTask['priority'],
    dueDate: ''
  });
  
  const [newWorksheet, setNewWorksheet] = useState({
    title: '',
    description: ''
  });
  
  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    createTask({
      title: newTask.title,
      description: newTask.description,
      status: selectedTaskStatus,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined
    });
    
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: ''
    });
    
    setIsCreateTaskOpen(false);
  };
  
  const handleCreateWorksheet = () => {
    if (!newWorksheet.title.trim()) {
      toast.error("Worksheet title is required");
      return;
    }
    
    createWorksheet(
      newWorksheet.title, 
      newWorksheet.description
    );
    
    setNewWorksheet({
      title: '',
      description: ''
    });
    
    setIsCreateWorksheetOpen(false);
  };
  
  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };
  
  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    updateTask(selectedTask.id, selectedTask);
    setIsEditTaskOpen(false);
  };
  
  const handleDeleteTask = () => {
    if (!selectedTask) return;
    
    deleteTask(selectedTask.id);
    setIsEditTaskOpen(false);
  };
  
  const handleDrop = (task: KanbanTask, newStatus: KanbanStatus) => {
    if (task.status !== newStatus) {
      moveTask(task.id, newStatus);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Worksheet navigation */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
        {worksheets.map(worksheet => (
          <Button
            key={worksheet.id}
            variant={currentWorksheet?.id === worksheet.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentWorksheet(worksheet)}
            className="whitespace-nowrap"
          >
            <Layout className="h-4 w-4 mr-2" />
            {worksheet.title}
          </Button>
        ))}
        
        <Dialog open={isCreateWorksheetOpen} onOpenChange={setIsCreateWorksheetOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="worksheetTitle">Board Name</Label>
                <Input
                  id="worksheetTitle"
                  value={newWorksheet.title}
                  onChange={(e) => setNewWorksheet({...newWorksheet, title: e.target.value})}
                  placeholder="Enter board name"
                />
              </div>
              <div>
                <Label htmlFor="worksheetDescription">Description (optional)</Label>
                <Textarea
                  id="worksheetDescription"
                  value={newWorksheet.description}
                  onChange={(e) => setNewWorksheet({...newWorksheet, description: e.target.value})}
                  placeholder="Describe the purpose of this board"
                  className="h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateWorksheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorksheet}>
                Create Board
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Current worksheet information */}
      {currentWorksheet && (
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{currentWorksheet.title}</h2>
            {currentWorksheet.description && (
              <p className="text-sm text-muted-foreground">{currentWorksheet.description}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={tasksByStatus.todo}
          onAddTask={(status) => {
            setSelectedTaskStatus(status);
            setIsCreateTaskOpen(true);
          }}
          onTaskClick={handleTaskClick}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={tasksByStatus['in-progress']}
          onAddTask={(status) => {
            setSelectedTaskStatus(status);
            setIsCreateTaskOpen(true);
          }}
          onTaskClick={handleTaskClick}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="Review"
          status="review"
          tasks={tasksByStatus.review}
          onAddTask={(status) => {
            setSelectedTaskStatus(status);
            setIsCreateTaskOpen(true);
          }}
          onTaskClick={handleTaskClick}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={tasksByStatus.done}
          onAddTask={(status) => {
            setSelectedTaskStatus(status);
            setIsCreateTaskOpen(true);
          }}
          onTaskClick={handleTaskClick}
          onDrop={handleDrop}
        />
      </div>
      
      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label htmlFor="taskDescription">Description (optional)</Label>
              <Textarea
                id="taskDescription"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Describe the task"
                className="h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskStatus">Status</Label>
                <Select
                  value={selectedTaskStatus}
                  onValueChange={(value) => setSelectedTaskStatus(value as KanbanStatus)}
                >
                  <SelectTrigger id="taskStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taskPriority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value as KanbanTask['priority']})}
                >
                  <SelectTrigger id="taskPriority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="taskDueDate">Due Date (optional)</Label>
              <Input
                id="taskDueDate"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                placeholder="e.g. Sep 30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      {selectedTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="editTaskTitle">Task Title</Label>
                <Input
                  id="editTaskTitle"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editTaskDescription">Description</Label>
                <Textarea
                  id="editTaskDescription"
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  className="h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editTaskStatus">Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) => setSelectedTask({...selectedTask, status: value as KanbanStatus})}
                  >
                    <SelectTrigger id="editTaskStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editTaskPriority">Priority</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) => setSelectedTask({...selectedTask, priority: value as KanbanTask['priority']})}
                  >
                    <SelectTrigger id="editTaskPriority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editTaskDueDate">Due Date</Label>
                <Input
                  id="editTaskDueDate"
                  value={selectedTask.dueDate || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                  placeholder="e.g. Sep 30"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="destructive" size="sm" onClick={handleDeleteTask}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Task
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTask}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default KanbanBoard;
