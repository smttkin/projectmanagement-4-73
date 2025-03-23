
import { toast } from 'sonner';

// Base API service with common functionality
export class ApiService {
  protected baseUrl: string;
  protected resourceName: string;

  constructor(resourceName: string) {
    this.baseUrl = '/api'; // In a real app, this would be an environment variable
    this.resourceName = resourceName;
  }

  // Simulate network delay
  protected delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Handle API errors consistently
  protected handleError(error: any, customMessage?: string): never {
    const message = customMessage || `Error in ${this.resourceName} service: ${error.message}`;
    console.error(message, error);
    toast.error(message);
    throw error;
  }

  // Simulate successful API response
  protected async simulateResponse<T>(data: T, errorChance: number = 0): Promise<T> {
    await this.delay();
    
    // Randomly simulate errors (only in development and if errorChance > 0)
    if (import.meta.env.DEV && errorChance > 0 && Math.random() < errorChance) {
      throw new Error(`Random ${this.resourceName} service error`);
    }
    
    return data;
  }
}
