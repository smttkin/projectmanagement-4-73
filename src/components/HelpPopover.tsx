
import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  PlayCircle,
  PlusCircle,
  Settings,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const HELP_TOPICS = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: <PlayCircle className="h-4 w-4" />,
  },
  {
    id: "projects",
    title: "Projects Management",
    description: "How to create and manage projects",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    id: "teams",
    title: "Team Collaboration",
    description: "Working with team members",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "settings",
    title: "Account Settings",
    description: "Managing your account and preferences",
    icon: <Settings className="h-4 w-4" />,
  },
];

const HelpPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter help topics based on search query
  const filteredTopics = searchQuery
    ? HELP_TOPICS.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : HELP_TOPICS;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle opening a help topic
  const handleOpenTopic = (topicId: string) => {
    // In a real app, this would navigate to the help center or open a modal with the topic content
    const topic = HELP_TOPICS.find(t => t.id === topicId);
    if (topic) {
      toast.info(`Opening help topic: ${topic.title}`);
    }
    setIsOpen(false);
  };

  // Handle contacting support
  const handleContactSupport = () => {
    // In a real app, this would open a support ticket form or chat
    toast.success("Opening support chat window");
    // Simulate opening a chat window
    setTimeout(() => {
      toast("Live agent connected!", {
        description: "How can we help you today?",
        action: {
          label: "Reply",
          onClick: () => toast.info("Redirecting to chat window"),
        },
      });
    }, 1500);
    setIsOpen(false);
  };

  // Handle opening documentation
  const handleOpenDocumentation = () => {
    // In a real app, this would open the documentation in a new tab
    toast.info("Opening documentation in new tab");
    window.open("https://example.com/docs", "_blank");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help Center">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="p-4 pb-2">
          <h3 className="font-medium mb-1">Help Center</h3>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions or contact support
          </p>
          <div className="mt-3">
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="px-2 py-3 max-h-[280px] overflow-y-auto">
          <div className="space-y-1">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  className="w-full flex items-center p-2 rounded-md hover:bg-muted transition-colors text-left"
                  onClick={() => handleOpenTopic(topic.id)}
                >
                  <div className="flex-shrink-0 mr-3 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                </button>
              ))
            ) : (
              <div className="text-center py-6">
                <HelpCircle className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No help topics found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="border-t p-3 bg-muted/20 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleContactSupport}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleOpenDocumentation}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpPopover;
