
import React, { useRef, useEffect, useState } from 'react';
import { BoardScrollControls } from './BoardScrollControls';
import { BoardScrollArea } from './BoardScrollArea';
import { KanbanTask, KanbanStatus } from '@/types/kanban';

interface BoardContainerProps {
  columns: any[];
  tasksByStatus: Record<string, KanbanTask[]>;
  onAddTask: (status: KanbanStatus) => void;
  onTaskClick: (task: KanbanTask) => void;
  onDrop: (task: KanbanTask, newStatus: KanbanStatus) => void;
  onUpdateColumn: (columnId: string, updates: any) => void;
  onDeleteColumn: (columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isCreateColumnOpen: boolean;
  setIsCreateColumnOpen: (isOpen: boolean) => void;
  newColumn: { title: string; color: string };
  setNewColumn: (column: { title: string; color: string }) => void;
  closeCreateColumnModal: () => void;
  handleCreateColumn: () => void;
}

export const BoardContainer: React.FC<BoardContainerProps> = ({
  columns,
  tasksByStatus,
  onAddTask,
  onTaskClick,
  onDrop,
  onUpdateColumn,
  onDeleteColumn,
  onDeleteTask,
  isCreateColumnOpen,
  setIsCreateColumnOpen,
  newColumn,
  setNewColumn,
  closeCreateColumnModal,
  handleCreateColumn
}) => {
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
  
  return (
    <div className="relative flex-1 mt-4">
      <div className="h-[calc(100vh-250px)] overflow-hidden" ref={scrollContainerRef}>
        <BoardScrollControls 
          currentScrollIndex={currentScrollIndex}
          columnsLength={columns.length}
          columnsPerView={columnsPerView}
          onScrollLeft={scrollLeft}
          onScrollRight={scrollRight}
        />
        
        <BoardScrollArea 
          columns={columns}
          boardRef={boardRef}
          columnWidth={columnWidth}
          currentScrollIndex={currentScrollIndex}
          columnsPerView={columnsPerView}
          tasksByStatus={tasksByStatus}
          onAddTask={onAddTask}
          onTaskClick={onTaskClick}
          onDrop={onDrop}
          onUpdateColumn={onUpdateColumn}
          onDeleteColumn={onDeleteColumn}
          isCreateColumnOpen={isCreateColumnOpen}
          setIsCreateColumnOpen={setIsCreateColumnOpen}
          newColumn={newColumn}
          setNewColumn={setNewColumn}
          closeCreateColumnModal={closeCreateColumnModal}
          handleCreateColumn={handleCreateColumn}
          onDeleteTask={onDeleteTask}
          handleWheelScroll={handleWheelScroll}
        />
      </div>
    </div>
  );
};
