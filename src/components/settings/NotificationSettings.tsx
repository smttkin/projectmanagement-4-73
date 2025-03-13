
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    mentionNotifications: true,
    taskAssignments: true,
    projectUpdates: true,
  });
  
  // Handle notification toggle changes
  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  // Save notification settings
  const handleSaveNotificationSettings = () => {
    toast.success('Notification preferences updated');
  };
  
  return (
    <>
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control how and when you receive notifications
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium">Notification Channels</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={notificationSettings.emailNotifications} 
                onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={notificationSettings.pushNotifications} 
                onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest" className="text-base">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Get a summary of activity once a week</p>
              </div>
              <Switch 
                id="weekly-digest" 
                checked={notificationSettings.weeklyDigest} 
                onCheckedChange={(checked) => handleNotificationToggle('weeklyDigest', checked)} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium">Notification Types</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mention-notifications" className="text-base">Mentions</Label>
                <p className="text-sm text-muted-foreground">When you're mentioned in comments</p>
              </div>
              <Switch 
                id="mention-notifications" 
                checked={notificationSettings.mentionNotifications} 
                onCheckedChange={(checked) => handleNotificationToggle('mentionNotifications', checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="task-assignments" className="text-base">Task Assignments</Label>
                <p className="text-sm text-muted-foreground">When you're assigned to a task</p>
              </div>
              <Switch 
                id="task-assignments" 
                checked={notificationSettings.taskAssignments} 
                onCheckedChange={(checked) => handleNotificationToggle('taskAssignments', checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="project-updates" className="text-base">Project Updates</Label>
                <p className="text-sm text-muted-foreground">Changes to projects you're a part of</p>
              </div>
              <Switch 
                id="project-updates" 
                checked={notificationSettings.projectUpdates} 
                onCheckedChange={(checked) => handleNotificationToggle('projectUpdates', checked)} 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveNotificationSettings}>Update Preferences</Button>
        </div>
      </div>
    </>
  );
};
