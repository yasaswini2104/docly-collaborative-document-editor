import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import type { DocumentsResponse } from '../types/document';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
};

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentsResponse>('/api/documents');
      return data;
    },
  });
}
