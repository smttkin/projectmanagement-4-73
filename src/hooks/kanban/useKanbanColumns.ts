
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '@/services';
import { KanbanColumn } from '@/types/kanban';

export function useKanbanColumns(projectId: string, activeWorksheet: string | null) {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  // Fetch columns for active worksheet
  const columnsQuery = useQuery({
    queryKey: ['kanban-columns', projectId, activeWorksheet],
    queryFn: () => activeWorksheet ? kanbanService.getColumns(projectId, activeWorksheet) : Promise.resolve([]),
    enabled: !!activeWorksheet
  });

  // Set columns when data is loaded
  useEffect(() => {
    if (columnsQuery.data) {
      setColumns(columnsQuery.data);
    }
  }, [columnsQuery.data]);

  // Add a new column to active worksheet
  const addColumn = useCallback(async (title: string, color: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.createColumn(projectId, {
        title,
        color,
        worksheetId: activeWorksheet
      });
      columnsQuery.refetch();
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery]);

  // Update a column in active worksheet
  const updateColumn = useCallback(async (columnId: string, columnData: Partial<KanbanColumn>) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.updateColumn(projectId, columnId, columnData);
      columnsQuery.refetch();
    } catch (error) {
      console.error('Failed to update column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery]);

  // Delete a column from active worksheet
  const deleteColumn = useCallback(async (columnId: string) => {
    if (!activeWorksheet) return;
    
    try {
      await kanbanService.deleteColumn(projectId, columnId);
      columnsQuery.refetch();
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  }, [projectId, activeWorksheet, columnsQuery]);

  return {
    columns,
    addColumn,
    updateColumn,
    deleteColumn,
    isLoadingColumns: columnsQuery.isLoading,
    columnsError: columnsQuery.error,
    refetchColumns: columnsQuery.refetch
  };
}
