
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layout, Plus } from 'lucide-react';
import { KanbanWorksheet } from '@/types/kanban';

interface KanbanBoardHeaderProps {
  worksheets: KanbanWorksheet[];
  currentWorksheet: KanbanWorksheet | null;
  setCurrentWorksheet: (worksheet: KanbanWorksheet) => void;
  onCreateWorksheetClick: () => void;
}

export const KanbanBoardHeader: React.FC<KanbanBoardHeaderProps> = ({
  worksheets,
  currentWorksheet,
  setCurrentWorksheet,
  onCreateWorksheetClick
}) => {
  return (
    <>
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
        
        <Button variant="outline" size="sm" onClick={onCreateWorksheetClick}>
          <Plus className="h-4 w-4 mr-1" />
          New Board
        </Button>
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
    </>
  );
};
