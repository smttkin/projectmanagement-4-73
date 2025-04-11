
import { ApiService } from '../base/ApiService';
import { departmentDefinitions } from './mockData';

class DepartmentService extends ApiService {
  constructor() {
    super('departments');
  }

  /**
   * Get department definitions
   */
  async getDepartmentDefinitions() {
    try {
      await this.delay(200); // Short delay
      return departmentDefinitions;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch department definitions');
    }
  }
}

export const departmentService = new DepartmentService();
