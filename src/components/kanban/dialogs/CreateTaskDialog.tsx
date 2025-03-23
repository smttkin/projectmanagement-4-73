
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
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

interface CreateTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  taskData: {
    title: string;
    description: string;
    status: string;
    priority: KanbanTask['priority'];
    dueDate: string;
  };
  setTaskData: (data: any) => void;
  columns: KanbanColumn[];
  selectedStatus: KanbanStatus;
  setSelectedStatus: (status: KanbanStatus) => void;
  onSubmit: () => void;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  setIsOpen,
  taskData,
  setTaskData,
  columns,
  selectedStatus,
  setSelectedStatus,
  onSubmit
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    taskData.dueDate ? new Date(taskData.dueDate) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setTaskData({...taskData, dueDate: format(date, 'MMM dd, yyyy')});
    } else {
      setTaskData({...taskData, dueDate: ''});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          <div>
            <Label htmlFor="taskDescription">Description (optional)</Label>
            <Textarea
              id="taskDescription"
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              placeholder="Describe the task"
              className="h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taskStatus">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as KanbanStatus)}
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
                value={taskData.priority}
                onValueChange={(value) => setTaskData({...taskData, priority: value as KanbanTask['priority']})}
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
            <Label>Due Date (optional)</Label>
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
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
