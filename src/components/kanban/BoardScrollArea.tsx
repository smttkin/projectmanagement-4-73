
import React from 'react';
import { cn } from '@/lib/utils';
import KanbanColumn from './KanbanColumn';
import { AddColumnButton } from './AddColumnButton';
import { KanbanTask, KanbanStatus } from '@/types/kanban';

interface BoardScrollAreaProps {
  columns: any[];
  boardRef: React.RefObject<HTMLDivElement>;
  columnWidth: number;
  currentScrollIndex: number;
  columnsPerView: number;
  tasksByStatus: Record<string, KanbanTask[]>;
  onAddTask: (status: KanbanStatus) => void;
  onTaskClick: (task: KanbanTask) => void;
  onDrop: (task: KanbanTask, newStatus: KanbanStatus) => void;
  onUpdateColumn: (columnId: string, updates: any) => void;
  onDeleteColumn: (columnId: string) => void;
  isCreateColumnOpen: boolean;
  setIsCreateColumnOpen: (isOpen: boolean) => void;
  newColumn: { title: string; color: string };
  setNewColumn: (column: { title: string; color: string }) => void;
  closeCreateColumnModal: () => void;
  handleCreateColumn: () => void;
  onDeleteTask: (taskId: string) => void;
  handleWheelScroll: (e: React.WheelEvent) => void;
}

export const BoardScrollArea: React.FC<BoardScrollAreaProps> = ({
  columns,
  boardRef,
  columnWidth,
  tasksByStatus,
  onAddTask,
  onTaskClick,
  onDrop,
  onUpdateColumn,
  onDeleteColumn,
  isCreateColumnOpen,
  setIsCreateColumnOpen,
  newColumn,
  setNewColumn,
  closeCreateColumnModal,
  handleCreateColumn,
  onDeleteTask,
  handleWheelScroll
}) => {
  return (
    <div 
      ref={boardRef}
      className="flex space-x-2 pb-6 pr-4 overflow-x-auto kanban-scroll"
      style={{ minWidth: '100%', scrollSnapType: 'x mandatory' }}
      onWheel={handleWheelScroll}
    >
      {columns.map((column) => (
        <div 
          key={column.id} 
          className="transition-all duration-200 scroll-snap-align-start"
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
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
            onDrop={onDrop}
            onUpdateColumn={onUpdateColumn}
            onDeleteColumn={onDeleteColumn}
            onEditTask={onTaskClick}
            onDeleteTask={onDeleteTask}
          />
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
  );
};
