
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  FileText, 
  MessageSquare, 
  UserPlus, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'message' | 'mention' | 'assignment' | 'update' | 'due' | 'team';
  read: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New message from Sarah',
    description: 'Hi, can you review the latest design mockups?',
    time: '5 minutes ago',
    type: 'message',
    read: false
  },
  {
    id: '2',
    title: 'Meeting reminder',
    description: 'Team standup in 15 minutes',
    time: '15 minutes ago',
    type: 'due',
    read: false
  },
  {
    id: '3',
    title: 'New team member',
    description: 'James Wilson joined the Design team',
    time: '2 hours ago',
    type: 'team',
    read: false
  },
  {
    id: '4',
    title: 'Project update',
    description: 'Website redesign project is now 75% complete',
    time: '3 hours ago',
    type: 'update',
    read: true
  },
  {
    id: '5',
    title: 'Document shared',
    description: 'Alex shared "Q2 Marketing Strategy" with you',
    time: '5 hours ago',
    type: 'update',
    read: true
  },
  {
    id: '6',
    title: 'Task assigned to you',
    description: 'Review and approve homepage design',
    time: '1 day ago',
    type: 'assignment',
    read: true
  },
];

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'mention':
        return <MessageSquare className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'update':
        return <FileText className="h-4 w-4" />;
      case 'due':
        return <Clock className="h-4 w-4" />;
      case 'team':
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex p-4 hover:bg-accent transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
                    notification.read ? "bg-muted" : "bg-primary/10"
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="text-sm font-medium mb-1">No notifications</div>
              <div className="text-xs text-muted-foreground">
                You're all caught up!
              </div>
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Link to="/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full text-sm h-9">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
