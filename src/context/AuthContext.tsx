
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  bio?: string;
  phone?: string;
  location?: string;
  department?: string;
  position?: string;
  skills?: string[];
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// Mock user data (in a real app, this would come from an API)
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'admin' as const,
    bio: 'Experienced project manager with 7+ years in software development.',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Product',
    position: 'Project Manager',
    skills: ['Project Management', 'Agile', 'Team Leadership'],
    socialLinks: {
      twitter: 'https://twitter.com/example',
      github: 'https://github.com/example',
      linkedin: 'https://linkedin.com/in/example',
      website: 'https://example.com'
    }
  },
  {
    id: '2',
    email: 'member@example.com',
    password: 'password123',
    name: 'Team Member',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'member' as const,
    bio: 'Frontend developer with a passion for UI/UX',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    department: 'Engineering',
    position: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    socialLinks: {
      github: 'https://github.com/teammember',
      linkedin: 'https://linkedin.com/in/teammember'
    }
  },
];

// Store mock users in local storage if they don't exist
if (!localStorage.getItem('mockUsers')) {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    // Simulate network delay
    setTimeout(checkSession, 1000);
  }, []);

  // Update user in localStorage when it changes
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get users from local storage
        const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        const foundUser = storedUsers.find(
          (u: any) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          // Create user object (excluding password)
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          
          // Store in localStorage (in a real app, you'd use a token)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          toast.success('Login successful', {
            description: `Welcome back, ${userWithoutPassword.name}!`,
          });
          
          setIsLoading(false);
          resolve(true);
        } else {
          toast.error('Login failed', {
            description: 'Incorrect email or password',
          });
          
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get current users from local storage
        const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        
        // Check if email already exists
        const existingUser = storedUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          toast.error('Signup failed', {
            description: 'Email already in use',
          });
          
          setIsLoading(false);
          resolve(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: `${storedUsers.length + 1}`,
          email,
          password,
          name,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          role: 'member' as const,
        };
        
        // Add user to mock database
        storedUsers.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
        
        // Create user object (excluding password)
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        
        // Store in localStorage (in a real app, you'd use a token)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        toast.success('Account created successfully', {
          description: `Welcome, ${userWithoutPassword.name}!`,
        });
        
        setIsLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
