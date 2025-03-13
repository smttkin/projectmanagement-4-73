
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
  },
  {
    id: '2',
    email: 'member@example.com',
    password: 'password123',
    name: 'Team Member',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'member' as const,
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
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
