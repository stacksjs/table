import type { SearchResponse } from 'meilisearch'

export interface TableStore {
  source: string
  type: string
  columns: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string | boolean
  sorts?: string | string[]
  filterable?: string | boolean
  filters?: string | string[]
  actionable?: string | boolean
  actions?: string | string[]
  perPage: number
  currentPage: number
  results?: SearchResponse<Record<string, any>>

  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean
}