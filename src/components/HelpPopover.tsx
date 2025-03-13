
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  FileQuestion, 
  MessagesSquare, 
  Keyboard, 
  BookOpen, 
  Video 
} from 'lucide-react';

const HelpPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="font-semibold">Help & Resources</div>
          <div className="text-xs text-muted-foreground mt-1">
            Get help with using ProjectFlow
          </div>
        </div>
        <div className="divide-y">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none h-auto py-3 px-4"
          >
            <FileQuestion className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium text-sm">Documentation</div>
              <div className="text-xs text-muted-foreground">
                Read guides and documentation
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none h-auto py-3 px-4"
          >
            <Video className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium text-sm">Video Tutorials</div>
              <div className="text-xs text-muted-foreground">
                Watch step-by-step tutorials
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none h-auto py-3 px-4"
          >
            <Keyboard className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium text-sm">Keyboard Shortcuts</div>
              <div className="text-xs text-muted-foreground">
                View all available shortcuts
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none h-auto py-3 px-4"
          >
            <MessagesSquare className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium text-sm">Contact Support</div>
              <div className="text-xs text-muted-foreground">
                Get help from our support team
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none h-auto py-3 px-4"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium text-sm">Knowledge Base</div>
              <div className="text-xs text-muted-foreground">
                Browse articles and FAQs
              </div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpPopover;
