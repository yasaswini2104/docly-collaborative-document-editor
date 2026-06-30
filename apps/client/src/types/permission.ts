export type Role = 'VIEWER' | 'EDITOR';

export interface DocumentPermission {
  id: string;
  documentId: string;
  userId: string;
  role: Role;
  createdAt: string;
}
