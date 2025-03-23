import React, { useState, useRef } from 'react';
import KanbanColumn from './KanbanColumn';
import { KanbanTask, KanbanStatus, KanbanWorksheet } from '@/types/kanban';
import { Button } from '@/components/ui/button';
import { Plus, Layout, MoreHorizontal, X, Trash2, MessageSquare, Paperclip } from 'lucide-react';
import { useKanban } from '@/hooks/useKanban';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
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

const COLUMN_COLORS = [
  { label: 'Gray', value: 'bg-slate-100' },
  { label: 'Blue', value: 'bg-blue-100' },
  { label: 'Green', value: 'bg-green-100' },
  { label: 'Yellow', value: 'bg-amber-100' },
  { label: 'Red', value: 'bg-red-100' },
  { label: 'Purple', value: 'bg-purple-100' },
  { label: 'Pink', value: 'bg-pink-100' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const {
    worksheets,
    currentWorksheet,
    setCurrentWorksheet,
    createWorksheet,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    columns,
    addColumn,
    updateColumn,
    deleteColumn,
    addComment,
    addAttachment
  } = useKanban(projectId);
  
  const tasksByStatus = getTasksByStatus();
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateWorksheetOpen, setIsCreateWorksheetOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<KanbanStatus>('');
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '',
    priority: 'medium' as KanbanTask['priority'],
    dueDate: ''
  });
  
  const [newWorksheet, setNewWorksheet] = useState({
    title: '',
    description: ''
  });
  
  const [newColumn, setNewColumn] = useState({
    title: '',
    color: 'bg-slate-100'
  });
  
  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState({
    name: '',
    url: '',
    type: 'link',
    size: 0
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  
  const closeCreateColumnModal = () => {
    setIsCreateColumnOpen(false);
    setNewColumn({
      title: '',
      color: 'bg-slate-100'
    });
  };
  
  const closeEditTaskModal = () => {
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  };
  
  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    addTask({
      title: newTask.title,
      description: newTask.description,
      status: selectedTaskStatus,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      worksheetId: currentWorksheet?.id || ''
    });
    
    setNewTask({
      title: '',
      description: '',
      status: '',
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
  
  const handleCreateColumn = () => {
    if (!newColumn.title.trim()) {
      toast.error("Column title is required");
      return;
    }
    
    addColumn(newColumn.title, newColumn.color);
    
    setNewColumn({
      title: '',
      color: 'bg-slate-100'
    });
    
    closeCreateColumnModal();
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
    closeEditTaskModal();
  };
  
  const handleDrop = (task: KanbanTask, newStatus: KanbanStatus) => {
    if (task.status !== newStatus) {
      moveTask(task.id, newStatus);
    }
  };
  
  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    
    addComment(
      selectedTask.id, 
      newComment,
      'current-user', // In a real app, get the current user's ID
      'Current User' // In a real app, get the current user's name
    );
    
    setNewComment('');
  };
  
  const handleAddAttachment = () => {
    if (!selectedTask || !newAttachment.name.trim() || !newAttachment.url.trim()) return;
    
    addAttachment(
      selectedTask.id,
      newAttachment.name,
      newAttachment.url,
      newAttachment.type,
      newAttachment.size
    );
    
    setNewAttachment({
      name: '',
      url: '',
      type: 'link',
      size: 0
    });
  };
  
  const scrollRight = () => {
    if (boardRef.current) {
      boardRef.current.scrollBy({ left: 300, behavior: 'smooth' });
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
      <div className="relative">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div 
            ref={boardRef}
            className="flex space-x-4 pb-4 pr-16"
            style={{ minWidth: '100%' }}
          >
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByStatus[column.status] || []}
                onAddTask={(status) => {
                  setSelectedTaskStatus(status);
                  setIsCreateTaskOpen(true);
                }}
                onTaskClick={handleTaskClick}
                onDrop={handleDrop}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
                onEditTask={handleTaskClick}
                onDeleteTask={deleteTask}
              />
            ))}
            
            {/* Add new column button */}
            <Dialog open={isCreateColumnOpen} onOpenChange={setIsCreateColumnOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center min-w-12 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Column</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="columnTitle">Column Name</Label>
                    <Input
                      id="columnTitle"
                      value={newColumn.title}
                      onChange={(e) => setNewColumn({...newColumn, title: e.target.value})}
                      placeholder="Enter column name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="columnColor">Column Color</Label>
                    <Select
                      value={newColumn.color}
                      onValueChange={(value) => setNewColumn({...newColumn, color: value})}
                    >
                      <SelectTrigger id="columnColor">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMN_COLORS.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded ${color.value} mr-2`} />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={closeCreateColumnModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateColumn}>
                    Add Column
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollArea>
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
                    {columns.map(column => (
                      <SelectItem key={column.id} value={column.status}>
                        {column.title}
                      </SelectItem>
                    ))}
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
        <Dialog open={isEditTaskOpen} onOpenChange={closeEditTaskModal}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-2">
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
                      {columns.map(column => (
                        <SelectItem key={column.id} value={column.status}>
                          {column.title}
                        </SelectItem>
                      ))}
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
            
            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                Comments
              </h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                {selectedTask.comments && selectedTask.comments.length > 0 ? (
                  selectedTask.comments.map(comment => (
                    <div key={comment.id} className="bg-muted/50 p-2 rounded-md">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-3 mt-2 border-l-2 border-border space-y-2">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="bg-background p-2 rounded-md">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-medium">{reply.authorName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button size="sm" onClick={handleAddComment}>Add</Button>
              </div>
            </div>
            
            {/* Attachments Section */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Paperclip className="h-4 w-4 mr-1" />
                Attachments
              </h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                  selectedTask.attachments.map(attachment => (
                    <div key={attachment.id} className="bg-muted/50 p-2 rounded-md flex items-center justify-between">
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      placeholder="Attachment name"
                      value={newAttachment.name}
                      onChange={(e) => setNewAttachment({...newAttachment, name: e.target.value})}
                    />
                  </div>
                  <Select
                    value={newAttachment.type}
                    onValueChange={(value) => setNewAttachment({...newAttachment, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="URL"
                    value={newAttachment.url}
                    onChange={(e) => setNewAttachment({...newAttachment, url: e.target.value})}
                  />
                  <Button size="sm" onClick={handleAddAttachment}>Add</Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
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
