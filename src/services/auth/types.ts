
import { UserData } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Mock user data
export const mockUsers = [
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
