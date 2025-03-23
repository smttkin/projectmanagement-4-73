
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateWorksheetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  worksheetData: {
    title: string;
    description: string;
  };
  setWorksheetData: (data: any) => void;
  onSubmit: () => void;
}

export const CreateWorksheetDialog: React.FC<CreateWorksheetDialogProps> = ({
  isOpen,
  setIsOpen,
  worksheetData,
  setWorksheetData,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="worksheetTitle">Board Name</Label>
            <Input
              id="worksheetTitle"
              value={worksheetData.title}
              onChange={(e) => setWorksheetData({...worksheetData, title: e.target.value})}
              placeholder="Enter board name"
            />
          </div>
          <div>
            <Label htmlFor="worksheetDescription">Description (optional)</Label>
            <Textarea
              id="worksheetDescription"
              value={worksheetData.description}
              onChange={(e) => setWorksheetData({...worksheetData, description: e.target.value})}
              placeholder="Describe the purpose of this board"
              className="h-20"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
