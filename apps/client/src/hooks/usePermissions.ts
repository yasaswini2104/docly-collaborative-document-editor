import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import type { User } from '../types/user';
import type { DocumentPermission, Role } from '../types/permission';

export const permissionKeys = {
  all: ['permissions'] as const,
  list: (documentId: string) => [...permissionKeys.all, documentId] as const,
  users: ['users'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: permissionKeys.users,
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>('/api/users');
      return data;
    },
  });
}

export function usePermissions(documentId: string) {
  return useQuery({
    queryKey: permissionKeys.list(documentId),
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentPermission[]>(`/api/documents/${documentId}/permissions`);
      return data;
    },
    enabled: !!documentId,
  });
}

export function useShareDocument(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { data } = await apiClient.post<DocumentPermission>(`/api/documents/${documentId}/permissions`, {
        userId,
        role,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.list(documentId) });
    },
  });
}

export function useUpdatePermission(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { data } = await apiClient.patch<DocumentPermission>(`/api/documents/${documentId}/permissions/${userId}`, {
        role,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.list(documentId) });
    },
  });
}

export function useRevokePermission(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/documents/${documentId}/permissions/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.list(documentId) });
    },
  });
}
