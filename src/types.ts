/**
 * This file is used to define the types/interfaces used in the project.
 */

import type { SearchResponse } from 'meilisearch'

export interface TableStore {
  source: string
  type: string
  columns: string[]
  columnsExcludingLast: string[]
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
