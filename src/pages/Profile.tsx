
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  Check, 
  FileEdit, 
  Save, 
  X,
  Github,
  Linkedin,
  Twitter,
  Link as LinkIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    role: user?.role || 'Project Manager',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced project manager with 7+ years in software development. Passionate about building efficient teams and delivering projects on time.',
    skills: ['Project Management', 'Agile', 'Team Leadership', 'Risk Management', 'Budgeting'],
    socialLinks: {
      twitter: 'https://twitter.com/adminuser',
      github: 'https://github.com/adminuser',
      linkedin: 'https://linkedin.com/in/adminuser',
      website: 'https://example.com'
    }
  });
  
  // Handle editing profile
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };
  
  // Handle saving profile
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };
  
  // Handle canceling profile edit
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    toast.info('Edit cancelled');
  };
  
  // Handle profile data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle social link changes
  const handleSocialLinkChange = (platform: keyof typeof profileData.socialLinks, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  // Handle skill changes
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };
  
  // Handle adding a new skill
  const handleAddSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // Handle uploading a new profile photo
  const handleUploadPhoto = () => {
    // In a real app, this would open a file picker
    toast.info('Photo upload functionality would open a file picker');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-subtle">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            <div className="absolute top-16 left-6 flex items-end">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={user?.avatar || 'https://i.pravatar.cc/150?img=68'} alt={profileData.name} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <button 
                    className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                    onClick={handleUploadPhoto}
                  >
                    <Camera size={14} />
                  </button>
                )}
              </div>
              <div className="ml-4 pb-4">
                <h1 className="text-xl font-bold">{profileData.name}</h1>
                <p className="text-muted-foreground">{profileData.role}</p>
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              {isEditingProfile ? (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1"
                    onClick={handleCancelEdit}
                  >
                    <X size={14} />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={handleSaveProfile}
                  >
                    <Save size={14} />
                    Save
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1"
                  onClick={handleEditProfile}
                >
                  <FileEdit size={14} />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      {isEditingProfile ? (
                        <Input 
                          name="email" 
                          value={profileData.email} 
                          onChange={handleInputChange} 
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{profileData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      {isEditingProfile ? (
                        <Input 
                          name="phone" 
                          value={profileData.phone} 
                          onChange={handleInputChange} 
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{profileData.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Location</label>
                      {isEditingProfile ? (
                        <Input 
                          name="location" 
                          value={profileData.location} 
                          onChange={handleInputChange} 
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{profileData.location}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Twitter className="h-4 w-4 text-primary mr-2" />
                      {isEditingProfile ? (
                        <Input 
                          value={profileData.socialLinks.twitter} 
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)} 
                          placeholder="Twitter URL"
                          className="text-sm"
                        />
                      ) : (
                        <a 
                          href={profileData.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Twitter Profile
                        </a>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Github className="h-4 w-4 text-primary mr-2" />
                      {isEditingProfile ? (
                        <Input 
                          value={profileData.socialLinks.github} 
                          onChange={(e) => handleSocialLinkChange('github', e.target.value)} 
                          placeholder="GitHub URL"
                          className="text-sm"
                        />
                      ) : (
                        <a 
                          href={profileData.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          GitHub Profile
                        </a>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Linkedin className="h-4 w-4 text-primary mr-2" />
                      {isEditingProfile ? (
                        <Input 
                          value={profileData.socialLinks.linkedin} 
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} 
                          placeholder="LinkedIn URL"
                          className="text-sm"
                        />
                      ) : (
                        <a 
                          href={profileData.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 text-primary mr-2" />
                      {isEditingProfile ? (
                        <Input 
                          value={profileData.socialLinks.website} 
                          onChange={(e) => handleSocialLinkChange('website', e.target.value)} 
                          placeholder="Personal Website"
                          className="text-sm"
                        />
                      ) : (
                        <a 
                          href={profileData.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Personal Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Bio and Skills */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">About Me</h3>
                  {isEditingProfile ? (
                    <Textarea 
                      name="bio" 
                      value={profileData.bio} 
                      onChange={handleInputChange} 
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">{profileData.bio}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Skills</h3>
                    {isEditingProfile && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddSkill}
                      >
                        Add Skill
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className={`${
                          isEditingProfile 
                            ? 'bg-muted border-border' 
                            : 'bg-primary/10 border-primary/20'
                        } px-3 py-1.5 rounded-full border text-sm flex items-center gap-2`}
                      >
                        {isEditingProfile ? (
                          <>
                            <Input 
                              value={skill} 
                              onChange={(e) => handleSkillChange(index, e.target.value)} 
                              className="bg-transparent border-none p-0 h-auto w-auto min-w-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                            />
                            <button 
                              onClick={() => handleRemoveSkill(index)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <span>{skill}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Activity</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">Completed the Marketing Campaign project</p>
                        <p className="text-xs text-muted-foreground mt-0.5">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">Updated the Website Redesign project</p>
                        <p className="text-xs text-muted-foreground mt-0.5">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
