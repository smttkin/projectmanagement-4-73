
import React, { useState, useRef, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import { KanbanTask, KanbanStatus, KanbanWorksheet } from '@/types/kanban';
import { Button } from '@/components/ui/button';
import { Plus, Layout, MoreHorizontal, X, Trash2, MessageSquare, Paperclip, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useKanban } from '@/hooks/useKanban';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { KanbanBoardHeader } from './KanbanBoardHeader';
import { AddColumnButton } from './AddColumnButton';
import { CreateTaskDialog } from './dialogs/CreateTaskDialog';
import { TaskDetailsDialog } from './dialogs/TaskDetailsDialog';
import { CreateWorksheetDialog } from './dialogs/CreateWorksheetDialog';

interface KanbanBoardProps {
  projectId: string;
}

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [columnWidth, setColumnWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [columnsPerView, setColumnsPerView] = useState(3);
  
  useEffect(() => {
    const updateWidths = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.offsetWidth;
        setContainerWidth(containerWidth);
        
        // Calculate how many columns can fit in the view
        const calculatedColumnsPerView = Math.floor(containerWidth / 320) || 3;
        setColumnsPerView(calculatedColumnsPerView);
        
        // Set column width based on the container width and columns per view
        const colWidth = (containerWidth - 24) / columnsPerView;
        setColumnWidth(colWidth);
      }
    };
    
    updateWidths();
    window.addEventListener('resize', updateWidths);
    
    return () => {
      window.removeEventListener('resize', updateWidths);
    };
  }, []);
  
  const handleWheelScroll = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && e.deltaY !== 0) {
      // If vertical scrolling is more prominent, convert it to horizontal
      if (boardRef.current) {
        e.preventDefault();
        boardRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollToColumn = (index: number) => {
    if (boardRef.current && index >= 0 && index < columns.length) {
      setCurrentScrollIndex(index);
      const scrollPosition = index * columnWidth;
      boardRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentScrollIndex - columnsPerView);
    scrollToColumn(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(columns.length - 1, currentScrollIndex + columnsPerView);
    scrollToColumn(newIndex);
  };
  
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
  
  return (
    <div className="flex flex-col h-full">
      <KanbanBoardHeader 
        worksheets={worksheets}
        currentWorksheet={currentWorksheet}
        setCurrentWorksheet={setCurrentWorksheet}
        onCreateWorksheetClick={() => setIsCreateWorksheetOpen(true)}
      />
      
      <div className="relative flex-1 mt-4">
        <div className="h-[calc(100vh-250px)] overflow-hidden" ref={scrollContainerRef}>
          <div className="flex justify-between mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollLeft} 
              disabled={currentScrollIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollRight} 
              disabled={currentScrollIndex >= columns.length - columnsPerView}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <div 
            ref={boardRef}
            className="flex space-x-2 pb-6 pr-4 overflow-x-auto kanban-scroll"
            style={{ minWidth: '100%', scrollSnapType: 'x mandatory' }}
            onWheel={handleWheelScroll}
          >
            {columns.map((column, index) => (
              <div 
                key={column.id} 
                className={cn(
                  "transition-all duration-200 scroll-snap-align-start",
                  index >= columnsPerView ? "opacity-50" : ""
                )}
                style={{ 
                  width: `${columnWidth}px`,
                  minWidth: `${columnWidth}px`,
                  position: 'relative',
                  scrollSnapAlign: 'start'
                }}
              >
                <KanbanColumn
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
                
                {index === columnsPerView && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-none" />
                )}
              </div>
            ))}
            
            <div style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px` }}>
              <AddColumnButton 
                isOpen={isCreateColumnOpen}
                setIsOpen={setIsCreateColumnOpen}
                columnData={newColumn}
                setColumnData={setNewColumn}
                onClose={closeCreateColumnModal}
                onSubmit={handleCreateColumn}
              />
            </div>
          </div>
        </div>
      </div>
      
      <CreateTaskDialog 
        isOpen={isCreateTaskOpen}
        setIsOpen={setIsCreateTaskOpen}
        taskData={newTask}
        setTaskData={setNewTask}
        columns={columns}
        selectedStatus={selectedTaskStatus}
        setSelectedStatus={setSelectedTaskStatus}
        onSubmit={handleCreateTask}
      />
      
      <CreateWorksheetDialog
        isOpen={isCreateWorksheetOpen}
        setIsOpen={setIsCreateWorksheetOpen}
        worksheetData={newWorksheet}
        setWorksheetData={setNewWorksheet}
        onSubmit={handleCreateWorksheet}
      />
      
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isEditTaskOpen}
          setIsOpen={setIsEditTaskOpen}
          task={selectedTask}
          setTask={setSelectedTask}
          columns={columns}
          onClose={closeEditTaskModal}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
          newAttachment={newAttachment}
          setNewAttachment={setNewAttachment}
          onAddAttachment={handleAddAttachment}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
