export interface PagedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
