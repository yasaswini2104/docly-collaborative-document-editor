export interface DocumentListItem {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  owned: DocumentListItem[];
  shared: DocumentListItem[];
}
