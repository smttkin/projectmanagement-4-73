
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, Moon, Shield, User } from 'lucide-react';

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <>
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
    </>
  );
};
