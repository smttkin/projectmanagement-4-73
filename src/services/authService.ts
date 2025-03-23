
import { ApiService } from './api';
import { User } from '@/types/user';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

class AuthService extends ApiService {
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  constructor() {
    super('auth');
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // In a real app, this would be an API request
      // For demo, we'll check against mock users
      await this.delay(800);
      
      // Mock validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      if (!credentials.email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Demo users
      const mockUsers = [
        { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { id: '2', email: 'user@example.com', password: 'user123', name: 'Regular User', role: 'user' }
      ];
      
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      const userData = userWithoutPassword as User;
      
      // Store auth data in localStorage
      localStorage.setItem(this.tokenKey, `mock-token-${userData.id}-${Date.now()}`);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      return this.handleError(error, 'Login failed');
    }
  }
  
  async register(data: RegisterData): Promise<User> {
    try {
      await this.delay(1000);
      
      // Mock validation
      if (!data.email || !data.password || !data.name) {
        throw new Error('All fields are required');
      }
      
      if (!data.email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Check if email is already used
      const existingUser = localStorage.getItem('mock_users');
      const users = existingUser ? JSON.parse(existingUser) : [];
      
      if (users.some((u: any) => u.email === data.email)) {
        throw new Error('Email is already registered');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Save to mock storage
      users.push({ ...newUser, password: data.password });
      localStorage.setItem('mock_users', JSON.stringify(users));
      
      // Store auth data
      localStorage.setItem(this.tokenKey, `mock-token-${newUser.id}-${Date.now()}`);
      localStorage.setItem(this.userKey, JSON.stringify(newUser));
      
      return newUser as User;
    } catch (error) {
      return this.handleError(error, 'Registration failed');
    }
  }
  
  async logout(): Promise<void> {
    try {
      await this.delay(300);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      return;
    } catch (error) {
      return this.handleError(error, 'Logout failed');
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = localStorage.getItem(this.userKey);
      if (!userJson) return null;
      
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Error getting current user', error);
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
  
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      await this.delay(800);
      
      const userJson = localStorage.getItem(this.userKey);
      if (!userJson) {
        throw new Error('User not authenticated');
      }
      
      const currentUser = JSON.parse(userJson) as User;
      const updatedUser = { ...currentUser, ...data };
      
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return this.handleError(error, 'Profile update failed');
    }
  }
}

export const authService = new AuthService();
