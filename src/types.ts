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
  sort?: string // there can only be one active sort at a time
  sorts?: string | string[] // this is the list of all possible sort options
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
