export interface DocumentListItem {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document extends DocumentListItem {
  content: any;
  isOwner: boolean;
  effectiveRole: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface DocumentsResponse {
  owned: DocumentListItem[];
  shared: DocumentListItem[];
}
