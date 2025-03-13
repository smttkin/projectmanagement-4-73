
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export const AppearanceSettings = () => {
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    density: 'comfortable',
    animations: true,
  });
  
  // Handle appearance settings changes
  const handleAppearanceChange = (name: string, value: string | boolean) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    });
  };
  
  // Save appearance settings
  const handleSaveAppearanceSettings = () => {
    toast.success('Appearance settings saved');
  };
  
  return (
    <>
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
    </>
  );
};
