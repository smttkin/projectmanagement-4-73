
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated color options with theme-friendly choices
const COLUMN_COLORS = [
  { label: 'Gray', value: 'bg-slate-100 dark:bg-slate-800 dark:text-white' },
  { label: 'Blue', value: 'bg-blue-100 dark:bg-blue-900 dark:text-white' },
  { label: 'Green', value: 'bg-green-100 dark:bg-green-900 dark:text-white' },
  { label: 'Yellow', value: 'bg-amber-100 dark:bg-amber-900 dark:text-white' },
  { label: 'Red', value: 'bg-red-100 dark:bg-red-900 dark:text-white' },
  { label: 'Purple', value: 'bg-purple-100 dark:bg-purple-900 dark:text-white' },
  { label: 'Pink', value: 'bg-pink-100 dark:bg-pink-900 dark:text-white' },
];

interface AddColumnButtonProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  columnData: {
    title: string;
    color: string;
  };
  setColumnData: (data: { title: string; color: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddColumnButton: React.FC<AddColumnButtonProps> = ({
  isOpen,
  setIsOpen,
  columnData,
  setColumnData,
  onClose,
  onSubmit
}) => {
  // Function to get preview color class that works in both modes
  const getColorPreviewClass = (colorValue: string) => {
    // Extract just the light mode part for the preview
    const lightModeClass = colorValue.split(' ')[0];
    return `w-4 h-4 rounded ${lightModeClass} mr-2`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                value={columnData.title}
                onChange={(e) => setColumnData({...columnData, title: e.target.value})}
                placeholder="Enter column name"
              />
            </div>
            <div>
              <Label htmlFor="columnColor">Column Color</Label>
              <Select
                value={columnData.color}
                onValueChange={(value) => setColumnData({...columnData, color: value})}
              >
                <SelectTrigger id="columnColor">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLUMN_COLORS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={getColorPreviewClass(color.value)} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              Add Column
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
