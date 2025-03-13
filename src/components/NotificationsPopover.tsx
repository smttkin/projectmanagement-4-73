
import React, { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  FileCheck,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Sample notifications data
const notifications = [
  {
    id: "1",
    title: "Project deadline approaching",
    description: "Website Redesign project is due in 2 days",
    time: "2 hours ago",
    read: false,
    type: "deadline",
  },
  {
    id: "2",
    title: "New comment",
    description: "Alice commented on your task",
    time: "5 hours ago",
    read: false,
    type: "comment",
  },
  {
    id: "3",
    title: "Task assigned",
    description: "You've been assigned a new design task",
    time: "Yesterday",
    read: true,
    type: "task",
  },
  {
    id: "4",
    title: "Team meeting",
    description: "Weekly team meeting in 30 minutes",
    time: "Yesterday",
    read: true,
    type: "meeting",
  },
  {
    id: "5",
    title: "Project completed",
    description: "Marketing Campaign project marked as completed",
    time: "2 days ago",
    read: true,
    type: "completion",
  },
];

const NotificationsPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userNotifications, setUserNotifications] = useState(notifications);
  const unreadCount = userNotifications.filter((n) => !n.read).length;
  
  // Filter notifications based on tab
  const filteredNotifications = activeTab === "all" 
    ? userNotifications 
    : activeTab === "unread" 
    ? userNotifications.filter(n => !n.read) 
    : userNotifications.filter(n => n.read);
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "task":
        return <FileCheck className="h-4 w-4 text-purple-500" />;
      case "meeting":
        return <User className="h-4 w-4 text-green-500" />;
      case "completion":
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setUserNotifications(
      userNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUserNotifications(
      userNotifications.map((notification) => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setUserNotifications(
      userNotifications.filter((notification) => notification.id !== id)
    );
    toast.success("Notification removed");
  };

  // View notification details (in a real app this would navigate or show more info)
  const viewNotification = (id: string) => {
    // Mark as read first
    markAsRead(id);
    // In a real app, this might navigate to the relevant page
    toast.info("Viewing notification details");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs font-normal"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="max-h-[300px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No {activeTab === "unread" ? "unread " : activeTab === "read" ? "read " : ""}
                  notifications
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-3 hover:bg-muted transition-colors ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 cursor-pointer" onClick={() => viewNotification(notification.id)}>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1 flex items-center">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-center text-sm text-muted-foreground"
            onClick={() => {
              toast.info("Viewing all notifications");
              setIsOpen(false);
            }}
          >
            View all notifications
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
