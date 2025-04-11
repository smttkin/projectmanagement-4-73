
import { worksheetService } from './worksheetService';
import { columnService } from './columnService';
import { taskService } from './taskService';

export const kanbanService = {
  // Worksheet methods
  getWorksheets: worksheetService.getWorksheets.bind(worksheetService),
  createWorksheet: worksheetService.createWorksheet.bind(worksheetService),
  
  // Column methods
  getColumns: columnService.getColumns.bind(columnService),
  createColumn: columnService.createColumn.bind(columnService),
  updateColumn: columnService.updateColumn.bind(columnService),
  deleteColumn: columnService.deleteColumn.bind(columnService),
  
  // Task methods
  getTasks: taskService.getTasks.bind(taskService),
  createTask: taskService.createTask.bind(taskService),
  updateTask: taskService.updateTask.bind(taskService),
  deleteTask: taskService.deleteTask.bind(taskService),
  
  // Task interactions
  addComment: taskService.addComment.bind(taskService),
  addAttachment: taskService.addAttachment.bind(taskService),
};
