import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Camera, Github, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';

export const AccountSettings = () => {
  const { user, setUser } = useAuth();
  
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@example.com',
    language: 'english',
    timezone: 'pst',
    bio: user?.bio || 'Experienced project manager with 7+ years in software development.',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'San Francisco, CA',
    department: user?.department || 'Product',
    position: user?.position || 'Project Manager',
    skills: user?.skills || ['Project Management', 'Agile', 'Team Leadership'],
    socialLinks: {
      twitter: user?.socialLinks?.twitter || 'https://twitter.com/example',
      github: user?.socialLinks?.github || 'https://github.com/example',
      linkedin: user?.socialLinks?.linkedin || 'https://linkedin.com/in/example',
      website: user?.socialLinks?.website || 'https://example.com'
    }
  });
  
  // Handle account settings changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Handle social link changes
  const handleSocialLinkChange = (platform: keyof typeof accountSettings.socialLinks, value: string) => {
    setAccountSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  // Handle skills changes
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...accountSettings.skills];
    updatedSkills[index] = value;
    setAccountSettings(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };
  
  // Add a skill
  const handleAddSkill = () => {
    setAccountSettings(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };
  
  // Remove a skill
  const handleRemoveSkill = (index: number) => {
    setAccountSettings(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  // Handle profile photo update
  const handleProfilePhotoUpdate = () => {
    // In a real app, this would open a file dialog
    toast.info('This would open a file dialog to select a new profile photo');
  };
  
  // Save account settings
  const handleSaveAccountSettings = async () => {
    if (user) {
      try {
        // Update the user in the authContext
        const updatedUser = {
          ...user,
          name: accountSettings.name,
          email: accountSettings.email,
          bio: accountSettings.bio,
          phone: accountSettings.phone,
          location: accountSettings.location,
          department: accountSettings.department,
          position: accountSettings.position,
          skills: accountSettings.skills,
          socialLinks: accountSettings.socialLinks
        };
        
        // In a real app with API, we'd call:
        // const result = await authService.updateProfile(user.id, updatedUser);
        setUser(updatedUser);
        
        toast.success('Account settings saved successfully');
      } catch (error) {
        toast.error('Failed to save account settings');
        console.error(error);
      }
    } else {
      toast.error('You must be logged in to save account settings');
    }
  };
  
  return (
    <>
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and account preferences
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile overview section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || "https://i.pravatar.cc/150?img=68"} alt={accountSettings.name} />
                  <AvatarFallback>{accountSettings.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full w-6 h-6"
                  onClick={handleProfilePhotoUpdate}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <h3 className="font-medium">{accountSettings.name}</h3>
                <p className="text-sm text-muted-foreground">{accountSettings.position} at {accountSettings.department}</p>
                <p className="text-sm text-muted-foreground">{accountSettings.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Basic information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={accountSettings.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={accountSettings.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={accountSettings.phone} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location" 
              value={accountSettings.location} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={accountSettings.department} 
              onValueChange={(value) => handleSelectChange('department', value)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              value={accountSettings.position} 
              onChange={handleInputChange} 
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
        
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            value={accountSettings.bio} 
            onChange={handleInputChange} 
            className="min-h-[120px]"
          />
        </div>
        
        {/* Skills */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Skills</Label>
            <Button variant="outline" size="sm" onClick={handleAddSkill}>
              Add Skill
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {accountSettings.skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-muted flex items-center space-x-1 px-3 py-1 rounded-full"
              >
                <Input 
                  value={skill} 
                  onChange={(e) => handleSkillChange(index, e.target.value)} 
                  className="border-none bg-transparent p-0 h-auto w-auto min-w-0 focus-visible:ring-0"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full p-0"
                  onClick={() => handleRemoveSkill(index)}
                >
                  <span>×</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Links */}
        <div className="space-y-4">
          <Label>Social Links</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Twitter profile" 
                value={accountSettings.socialLinks.twitter} 
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="GitHub profile" 
                value={accountSettings.socialLinks.github} 
                onChange={(e) => handleSocialLinkChange('github', e.target.value)} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="LinkedIn profile" 
                value={accountSettings.socialLinks.linkedin} 
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Personal website" 
                value={accountSettings.socialLinks.website} 
                onChange={(e) => handleSocialLinkChange('website', e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveAccountSettings}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};
