
import React, { useState } from 'react';
import { KanbanTask, KanbanStatus, KanbanWorksheet } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { KanbanBoardHeader } from './KanbanBoardHeader';
import { BoardContainer } from './BoardContainer';
import { CreateTaskDialog } from './dialogs/CreateTaskDialog';
import { CreateWorksheetDialog } from './dialogs/CreateWorksheetDialog';
import { TaskDetailsDialog } from './dialogs/TaskDetailsDialog';
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
      
      <BoardContainer
        columns={columns}
        tasksByStatus={tasksByStatus}
        onAddTask={(status) => {
          setSelectedTaskStatus(status);
          setIsCreateTaskOpen(true);
        }}
        onTaskClick={handleTaskClick}
        onDrop={handleDrop}
        onUpdateColumn={updateColumn}
        onDeleteColumn={deleteColumn}
        onDeleteTask={deleteTask}
        isCreateColumnOpen={isCreateColumnOpen}
        setIsCreateColumnOpen={setIsCreateColumnOpen}
        newColumn={newColumn}
        setNewColumn={setNewColumn}
        closeCreateColumnModal={closeCreateColumnModal}
        handleCreateColumn={handleCreateColumn}
      />
      
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
