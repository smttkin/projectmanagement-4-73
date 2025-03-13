
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { AccountSettings } from '../components/settings/AccountSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  
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
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
                {activeTab === 'account' && <AccountSettings />}
                
                {activeTab === 'notifications' && <NotificationSettings />}
                
                {activeTab === 'appearance' && <AppearanceSettings />}
                
                {activeTab === 'security' && <SecuritySettings />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
