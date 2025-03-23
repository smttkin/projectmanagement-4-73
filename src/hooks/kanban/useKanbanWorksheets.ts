
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { kanbanService } from '@/services';
import { KanbanWorksheet } from '@/types/kanban';

export function useKanbanWorksheets(projectId: string) {
  const [worksheets, setWorksheets] = useState<KanbanWorksheet[]>([]);

  // Fetch kanban worksheets
  const worksheetsQuery = useQuery({
    queryKey: ['kanban-worksheets', projectId],
    queryFn: () => kanbanService.getWorksheets(projectId)
  });

  // Set worksheets when data is loaded
  useEffect(() => {
    if (worksheetsQuery.data) {
      setWorksheets(worksheetsQuery.data);
    }
  }, [worksheetsQuery.data]);

  // Add a new worksheet
  const createWorksheet = useCallback(async (title: string, description?: string) => {
    try {
      const newWorksheet = await kanbanService.createWorksheet(projectId, { title, description });
      worksheetsQuery.refetch();
      return newWorksheet;
    } catch (error) {
      console.error('Failed to add worksheet:', error);
      return null;
    }
  }, [projectId, worksheetsQuery]);

  return {
    worksheets,
    createWorksheet,
    isLoadingWorksheets: worksheetsQuery.isLoading,
    worksheetsError: worksheetsQuery.error,
    refetchWorksheets: worksheetsQuery.refetch
  };
}
