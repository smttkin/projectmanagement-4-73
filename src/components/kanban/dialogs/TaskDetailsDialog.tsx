
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Trash2, MessageSquare, Paperclip, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KanbanTask, KanbanStatus, KanbanColumn } from '@/types/kanban';

interface TaskDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: KanbanTask;
  setTask: (task: KanbanTask) => void;
  columns: KanbanColumn[];
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
  newAttachment: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
  setNewAttachment: (attachment: any) => void;
  onAddAttachment: () => void;
}

export const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  task,
  setTask,
  columns,
  onClose,
  onUpdate,
  onDelete,
  newComment,
  setNewComment,
  onAddComment,
  newAttachment,
  setNewAttachment,
  onAddAttachment
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setTask({...task, dueDate: format(date, 'MMM dd, yyyy')});
    } else {
      setTask({...task, dueDate: undefined});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div>
            <Label htmlFor="editTaskTitle">Task Title</Label>
            <Input
              id="editTaskTitle"
              value={task.title}
              onChange={(e) => setTask({...task, title: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="editTaskDescription">Description</Label>
            <Textarea
              id="editTaskDescription"
              value={task.description || ''}
              onChange={(e) => setTask({...task, description: e.target.value})}
              className="h-20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editTaskStatus">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) => setTask({...task, status: value as KanbanStatus})}
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
                value={task.priority}
                onValueChange={(value) => setTask({...task, priority: value as KanbanTask['priority']})}
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
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "MMM dd, yyyy") : <span>Select due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comments
          </h3>
          
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map(comment => (
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
            <Button size="sm" onClick={onAddComment}>Add</Button>
          </div>
        </div>
        
        {/* Attachments Section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Paperclip className="h-4 w-4 mr-1" />
            Attachments
          </h3>
          
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {task.attachments && task.attachments.length > 0 ? (
              task.attachments.map(attachment => (
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
              <Button size="sm" onClick={onAddAttachment}>Add</Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Task
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
