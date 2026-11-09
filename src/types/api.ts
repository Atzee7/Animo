import type { AnimeSummary } from "./anime";

export interface ApiError {
  error: string;
}

export interface SearchResponse {
  results: AnimeSummary[];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  total: number;
  hasNextPage: boolean;
}
