
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  ShieldCheck, 
  Palette, 
  Globe, 
  CreditCard,
  Users,
  Save
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from 'sonner';

// Mock settings data
const initialSettings = {
  appearance: {
    theme: 'system',
    fontSize: 16,
    reducedMotion: false,
    compactMode: false,
  },
  notifications: {
    email: true,
    browser: true,
    mobile: true,
    weeklyDigest: true,
    mentions: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginNotifications: true,
    saveLoginInfo: true,
  },
  language: {
    displayLanguage: 'en',
    contentLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  teamManagement: {
    allowInvites: true,
    restrictedAccess: false,
    visibilityScope: 'team',
    approvalRequired: true,
  },
};

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    });
  };

  const handleNotificationsChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value,
      },
    });
  };

  const handleLanguageChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      language: {
        ...settings.language,
        [key]: value,
      },
    });
  };

  const handleTeamManagementChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      teamManagement: {
        ...settings.teamManagement,
        [key]: value,
      },
    });
  };

  const saveSettings = () => {
    // In a real app, this would call an API to save the settings
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and application settings</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar navigation for settings */}
          <Card className="border shadow-sm md:sticky md:top-20 h-fit">
            <CardContent className="p-4">
              <Tabs
                orientation="vertical"
                defaultValue="appearance"
                className="w-full"
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                  <TabsTrigger
                    value="appearance"
                    className="justify-start px-3 py-2"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="justify-start px-3 py-2"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="justify-start px-3 py-2"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="language"
                    className="justify-start px-3 py-2"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Language & Region
                  </TabsTrigger>
                  <TabsTrigger
                    value="teams"
                    className="justify-start px-3 py-2"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Team Management
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="justify-start px-3 py-2"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="justify-start px-3 py-2"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Settings content */}
          <div className="space-y-6">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how ProjectFlow looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={settings.appearance.theme}
                      onValueChange={(value) => handleAppearanceChange('theme', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Font Size ({settings.appearance.fontSize}px)</Label>
                    </div>
                    <Slider
                      value={[settings.appearance.fontSize]}
                      min={12}
                      max={20}
                      step={1}
                      onValueChange={(value) => handleAppearanceChange('fontSize', value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce animation and visual effects
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleAppearanceChange('reducedMotion', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and density of UI elements
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleNotificationsChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show desktop notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.browser}
                      onCheckedChange={(checked) => handleNotificationsChange('browser', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mobile Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.mobile}
                      onCheckedChange={(checked) => handleNotificationsChange('mobile', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Get a weekly summary of activity
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationsChange('weeklyDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone mentions you
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.mentions}
                      onCheckedChange={(checked) => handleNotificationsChange('mentions', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.loginNotifications}
                      onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remember Login Information</Label>
                      <p className="text-sm text-muted-foreground">
                        Stay logged in across sessions
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.saveLoginInfo}
                      onCheckedChange={(checked) => handleSecurityChange('saveLoginInfo', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language & Region Settings */}
            {activeTab === 'language' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>
                    Customize language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Display Language</Label>
                    <Select
                      value={settings.language.displayLanguage}
                      onValueChange={(value) => handleLanguageChange('displayLanguage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select display language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Content Language</Label>
                    <Select
                      value={settings.language.contentLanguage}
                      onValueChange={(value) => handleLanguageChange('contentLanguage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={settings.language.dateFormat}
                      onValueChange={(value) => handleLanguageChange('dateFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select
                      value={settings.language.timeFormat}
                      onValueChange={(value) => handleLanguageChange('timeFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Management Settings */}
            {activeTab === 'teams' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Configure team access and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Member Invitations</Label>
                      <p className="text-sm text-muted-foreground">
                        Team members can invite others to join
                      </p>
                    </div>
                    <Switch
                      checked={settings.teamManagement.allowInvites}
                      onCheckedChange={(checked) => handleTeamManagementChange('allowInvites', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Restricted Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Only admins can add or remove members
                      </p>
                    </div>
                    <Switch
                      checked={settings.teamManagement.restrictedAccess}
                      onCheckedChange={(checked) => handleTeamManagementChange('restrictedAccess', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Visibility</Label>
                    <Select
                      value={settings.teamManagement.visibilityScope}
                      onValueChange={(value) => handleTeamManagementChange('visibilityScope', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Entire organization</SelectItem>
                        <SelectItem value="team">Team members only</SelectItem>
                        <SelectItem value="restricted">Restricted by role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Approval for New Members</Label>
                      <p className="text-sm text-muted-foreground">
                        Admin approval required for new team members
                      </p>
                    </div>
                    <Switch
                      checked={settings.teamManagement.approvalRequired}
                      onCheckedChange={(checked) => handleTeamManagementChange('approvalRequired', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border rounded-md bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xl">Professional</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          $12 per user/month, billed annually
                        </div>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <div className="flex items-center border p-4 rounded-md">
                      <div className="h-8 w-12 bg-muted rounded mr-4"></div>
                      <div>
                        <div className="font-medium">VISA ending in 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">Update Card</Button>
                      <Button variant="outline" size="sm">Add Payment Method</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Billing History</h3>
                    <div className="text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <div>April 1, 2023</div>
                        <div className="font-medium">$144.00</div>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <div>March 1, 2023</div>
                        <div className="font-medium">$144.00</div>
                      </div>
                      <div className="flex justify-between py-2">
                        <div>February 1, 2023</div>
                        <div className="font-medium">$144.00</div>
                      </div>
                    </div>
                    <Button variant="link" className="p-0 h-auto" size="sm">
                      View all invoices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Account Name</Label>
                      <div className="font-medium">{user?.name}</div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Email Address</Label>
                      <div className="font-medium">{user?.email}</div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Role</Label>
                      <div className="font-medium capitalize">{user?.role}</div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Account Created</Label>
                      <div className="font-medium">June 2021</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="mr-2">
                      Change Password
                    </Button>
                    <Button variant="outline">
                      Update Email
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline">Export Account Data</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
