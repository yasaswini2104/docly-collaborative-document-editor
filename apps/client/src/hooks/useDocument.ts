import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { documentKeys } from './useDocuments';
import type { Document } from '../types/document';

export const documentDetailKeys = {
  detail: (id: string) => [...documentKeys.all, 'detail', id] as const,
};

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentDetailKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Document>(`/api/documents/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title?: string; content?: any }) => {
      const response = await apiClient.patch<Document>(`/api/documents/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the individual document cache
      queryClient.setQueryData(documentDetailKeys.detail(data.id), data);
      
      // Invalidate the list queries so the titles update on the dashboard
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string = 'Untitled Document') => {
      const response = await apiClient.post<Document>('/api/documents', { title });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the lists so the new document appears on the dashboard
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      // Prime the cache for the detail view so the editor loads instantly
      queryClient.setQueryData(documentDetailKeys.detail(data.id), data);
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<Document>(`/api/documents/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(documentDetailKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
