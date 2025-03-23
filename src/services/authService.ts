
import { ApiService } from './api';
import { UserData } from '@/types/user';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Team Member',
    email: 'user@example.com',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'user',
  }
];

class AuthService extends ApiService {
  private storageKey = 'auth_user';
  
  constructor() {
    super('auth');
    this.initializeStorage();
  }
  
  // Initialize local storage with mock users
  private initializeStorage(): void {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }
  
  // Get users from local storage
  private getUsers(): UserData[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }
  
  // Check if user is currently logged in
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
  
  // Get current user from local storage
  getCurrentUser(): UserData | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
  
  // Set current user in local storage
  private setCurrentUser(user: UserData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
  
  // Perform login
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      // Simulate API call with a delay
      await this.delay();
      
      // Find user
      const users = this.getUsers();
      const user = users.find(u => u.email === credentials.email);
      
      // In a real app, we would verify the password here
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Save to local storage
      this.setCurrentUser(user);
      toast.success('Logged in successfully');
      
      return user;
    } catch (error) {
      return this.handleError(error, 'Login failed');
    }
  }
  
  // Perform logout
  async logout(): Promise<void> {
    try {
      await this.delay(100); // Shorter delay for logout
      localStorage.removeItem(this.storageKey);
      toast.success('Logged out successfully');
    } catch (error) {
      this.handleError(error, 'Logout failed');
    }
  }
  
  // Register a new user
  async register(data: RegisterData): Promise<UserData> {
    try {
      await this.delay();
      
      // Check if email already exists
      const users = this.getUsers();
      if (users.some(u => u.email === data.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: UserData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        role: 'user',
      };
      
      // Add to users and save
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Auto login
      this.setCurrentUser(newUser);
      toast.success('Registration successful');
      
      return newUser;
    } catch (error) {
      return this.handleError(error, 'Registration failed');
    }
  }
  
  // Update user profile
  async updateProfile(userId: string, updates: Partial<Omit<UserData, 'id'>>): Promise<UserData> {
    try {
      await this.delay();
      
      // Get users
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        ...updates
      };
      
      users[userIndex] = updatedUser;
      
      // Save changes
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(updatedUser);
      }
      
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      return this.handleError(error, 'Failed to update profile');
    }
  }
}

export const authService = new AuthService();
