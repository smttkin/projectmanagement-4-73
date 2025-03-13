
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30min',
    passwordLastChanged: '2 months ago',
  });

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Handle security settings changes
  const handleSecurityChange = (name: string, value: string | boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [name]: value,
    });
  };
  
  // Save security settings
  const handleSaveSecuritySettings = () => {
    toast.success('Security settings updated successfully');
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
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setSecuritySettings({
      ...securitySettings,
      passwordLastChanged: 'Just now'
    });
    
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully');
  };
  
  return (
    <>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Change Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change Password</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter your new password below. Choose a strong password with a mix of letters, numbers, and special characters.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => {
                        setNewPassword('');
                        setConfirmPassword('');
                      }}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleChangePassword}>
                        Change Password
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
          <Button onClick={handleSaveSecuritySettings}>Save Security Settings</Button>
        </div>
      </div>
    </>
  );
};
