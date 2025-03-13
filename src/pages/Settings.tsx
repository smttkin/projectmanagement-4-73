
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { BellRing, Globe, Lock, Moon, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    language: 'english',
    timezone: 'pst',
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    mentionNotifications: true,
    taskAssignments: true,
    projectUpdates: true,
  });
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    density: 'comfortable',
    animations: true,
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30min',
    passwordLastChanged: '2 months ago',
  });
  
  // Handle account settings changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings({
      ...accountSettings,
      [name]: value,
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setAccountSettings({
      ...accountSettings,
      [name]: value,
    });
  };
  
  // Handle notification toggle changes
  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  // Handle appearance settings changes
  const handleAppearanceChange = (name: string, value: string | boolean) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    });
  };
  
  // Handle security settings changes
  const handleSecurityChange = (name: string, value: string | boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [name]: value,
    });
  };
  
  // Save account settings
  const handleSaveAccountSettings = () => {
    toast.success('Account settings saved successfully');
  };
  
  // Save notification settings
  const handleSaveNotificationSettings = () => {
    toast.success('Notification preferences updated');
  };
  
  // Save appearance settings
  const handleSaveAppearanceSettings = () => {
    toast.success('Appearance settings saved');
  };
  
  // Enable two-factor authentication
  const handleEnableTwoFactor = () => {
    setSecuritySettings({
      ...securitySettings,
      twoFactorAuth: true,
    });
    toast.success('Two-factor authentication enabled');
  };
  
  // Change password
  const handleChangePassword = () => {
    toast.info('Password change dialog would open here');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Tabs 
                orientation="vertical" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="hidden lg:block"
              >
                <TabsList className="flex flex-col h-auto bg-transparent p-0 border-r border-border">
                  <TabsTrigger 
                    value="account" 
                    className="justify-start px-4 py-2 data-[state=active]:bg-accent/50 data-[state=active]:border-r-2 data-[state=active]:border-primary rounded-none"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start px-4 py-2 data-[state=active]:bg-accent/50 data-[state=active]:border-r-2 data-[state=active]:border-primary rounded-none"
                  >
                    <BellRing className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appearance" 
                    className="justify-start px-4 py-2 data-[state=active]:bg-accent/50 data-[state=active]:border-r-2 data-[state=active]:border-primary rounded-none"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start px-4 py-2 data-[state=active]:bg-accent/50 data-[state=active]:border-r-2 data-[state=active]:border-primary rounded-none"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="account">
                    <User className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <BellRing className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Moon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
                {/* Account Settings */}
                <TabsContent value="account" className="m-0">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Account Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your profile and account preferences
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={accountSettings.name} 
                          onChange={handleAccountChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={accountSettings.email} 
                          onChange={handleAccountChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={accountSettings.language} 
                          onValueChange={(value) => handleSelectChange('language', value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="chinese">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={accountSettings.timezone} 
                          onValueChange={(value) => handleSelectChange('timezone', value)}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveAccountSettings}>Save Changes</Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Notification Settings */}
                <TabsContent value="notifications" className="m-0">
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
                </TabsContent>
                
                {/* Appearance Settings */}
                <TabsContent value="appearance" className="m-0">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Appearance</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize how the application looks
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select 
                          value={appearanceSettings.theme} 
                          onValueChange={(value) => handleAppearanceChange('theme', value)}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="density">Density</Label>
                        <Select 
                          value={appearanceSettings.density} 
                          onValueChange={(value) => handleAppearanceChange('density', value)}
                        >
                          <SelectTrigger id="density">
                            <SelectValue placeholder="Select density" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comfortable">Comfortable</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="animations" className="text-base">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable UI animations</p>
                        </div>
                        <Switch 
                          id="animations" 
                          checked={appearanceSettings.animations} 
                          onCheckedChange={(checked) => handleAppearanceChange('animations', checked)} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveAppearanceSettings}>Save Preferences</Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Security Settings */}
                <TabsContent value="security" className="m-0">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Security</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your security settings and password
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-medium ${securitySettings.twoFactorAuth ? 'text-green-600' : 'text-amber-600'}`}>
                            {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                          </span>
                          {!securitySettings.twoFactorAuth && (
                            <Button
                              size="sm"
                              onClick={handleEnableTwoFactor}
                            >
                              Enable
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Password</h3>
                        <div className="mt-2 p-4 border border-border rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">Password last changed:</p>
                              <p className="text-sm font-medium mt-1">{securitySettings.passwordLastChanged}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleChangePassword}
                            >
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <Select 
                          value={securitySettings.sessionTimeout} 
                          onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                        >
                          <SelectTrigger id="session-timeout">
                            <SelectValue placeholder="Select timeout period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15min">15 minutes</SelectItem>
                            <SelectItem value="30min">30 minutes</SelectItem>
                            <SelectItem value="1hour">1 hour</SelectItem>
                            <SelectItem value="4hours">4 hours</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          You'll be logged out after this period of inactivity
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Security Settings</Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
