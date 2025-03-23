
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BoardScrollControlsProps {
  currentScrollIndex: number;
  columnsLength: number;
  columnsPerView: number;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export const BoardScrollControls: React.FC<BoardScrollControlsProps> = ({
  currentScrollIndex,
  columnsLength,
  columnsPerView,
  onScrollLeft,
  onScrollRight
}) => {
  return (
    <div className="flex justify-between mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onScrollLeft} 
        disabled={currentScrollIndex === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onScrollRight} 
        disabled={currentScrollIndex >= columnsLength - columnsPerView}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
