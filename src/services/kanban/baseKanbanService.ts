
import { ApiService } from '../base/ApiService';

export class BaseKanbanService extends ApiService {
  constructor(resourceName: string) {
    super(resourceName);
  }
  
  // Get storage key for specific project resources
  protected getStorageKey(projectId: string, resource: string): string {
    return `${resource}-${projectId}`;
  }
  
  // Generic methods to get and save data to localStorage
  protected getData<T>(projectId: string, resource: string): T[] {
    const key = this.getStorageKey(projectId, resource);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  }
  
  protected saveData<T>(projectId: string, resource: string, data: T[]): void {
    const key = this.getStorageKey(projectId, resource);
    localStorage.setItem(key, JSON.stringify(data));
  }
}
