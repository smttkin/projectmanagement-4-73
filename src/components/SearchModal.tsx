
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, FolderSearch, Layers, Search, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  type: "project" | "task" | "document" | "user" | "team" | "event";
  url: string;
  icon: React.ReactNode;
  description?: string;
}

const searchResults: SearchResult[] = [
  {
    id: "p1",
    title: "Website Redesign",
    type: "project",
    url: "/dashboard",
    icon: <Layers className="h-4 w-4 text-blue-500" />,
    description: "Main company website overhaul project"
  },
  {
    id: "p2",
    title: "Mobile App Development",
    type: "project",
    url: "/dashboard",
    icon: <Layers className="h-4 w-4 text-blue-500" />,
    description: "Cross-platform mobile application"
  },
  {
    id: "t1",
    title: "Update homepage hero section",
    type: "task",
    url: "/dashboard",
    icon: <FileText className="h-4 w-4 text-green-500" />,
    description: "Part of Website Redesign project"
  },
  {
    id: "d1",
    title: "Marketing Strategy Document",
    type: "document",
    url: "/dashboard",
    icon: <FileText className="h-4 w-4 text-yellow-500" />,
    description: "Q3 marketing plan and strategy"
  },
  {
    id: "u1",
    title: "Alice Johnson",
    type: "user",
    url: "/team",
    icon: <User className="h-4 w-4 text-purple-500" />,
    description: "Project Manager"
  },
  {
    id: "t1",
    title: "Design Team",
    type: "team",
    url: "/team",
    icon: <Users className="h-4 w-4 text-indigo-500" />,
    description: "UI/UX design team members"
  },
  {
    id: "e1",
    title: "Team Meeting",
    type: "event",
    url: "/calendar",
    icon: <Calendar className="h-4 w-4 text-red-500" />,
    description: "Weekly team sync - Tomorrow at 10:00 AM"
  }
];

const getTypeLabel = (type: string) => {
  switch (type) {
    case "project":
      return "Projects";
    case "task":
      return "Tasks";
    case "document":
      return "Documents";
    case "user":
      return "Users";
    case "team":
      return "Teams";
    case "event":
      return "Events";
    default:
      return "Results";
  }
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>(searchResults);
  const navigate = useNavigate();

  // Filter results based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredResults(searchResults);
    } else {
      const filtered = searchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          (result.description &&
            result.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredResults(filtered);
    }
  }, [query]);

  // Group results by type
  const groupedResults = filteredResults.reduce((acc, result) => {
    const type = result.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    // In a real app, you might want to do something with the specific item ID
  };

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search for anything..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6">
                <FolderSearch className="h-10 w-10 text-muted-foreground opacity-30" />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
              </div>
            </CommandEmpty>
            {Object.entries(groupedResults).map(([type, results]) => (
              <CommandGroup key={type} heading={getTypeLabel(type)}>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelectResult(result)}
                    className="px-4 py-2"
                  >
                    <div className="flex items-center">
                      {result.type === "user" ? (
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${result.id}`} alt={result.title} />
                          <AvatarFallback className="text-xs">{result.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="mr-2">{result.icon}</span>
                      )}
                      <div>
                        <p className="text-sm font-medium">{result.title}</p>
                        {result.description && (
                          <p className="text-xs text-muted-foreground">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="border-t p-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                <span className="hidden sm:inline-block">Press</span>{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">↵</span>
                </kbd>{" "}
                <span className="hidden sm:inline-block">to select</span>
              </div>
              <div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">Esc</span>
                </kbd>{" "}
                <span className="hidden sm:inline-block">to close</span>
              </div>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
