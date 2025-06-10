export interface NotToDoItem {
  id: number;
  title: string;
  category?: string;
  failCount: number;
  createdAt: string;
  lastFailed?: string;
}