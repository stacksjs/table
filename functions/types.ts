/**
 * This file is used to define the types/interfaces used in the project.
 */

import type { Hits, SearchResponse } from 'meilisearch'

// the TableStore interface is primarily used with regards to how to persist the data to localStorage
export interface TableStore {
  /**
   * The type of table, e.g. 'users', 'posts', 'products', etc.
   * i.e. the Meilisearch index name
   */
  index: string
  columns: string[] // used as table heads/column titles
  source?: string // optional: the Meilisearch host name/address (defaults: http://127.0.0.1:7700)
  password?: string // optional: the Meilisearch password (defaults: '')
  searchable?: string | boolean // optional: determines whether the table displays the search bar (defaults: true)
  query?: string // optional: the "query" (= search input) used to search the table (defaults: '')
  sortable?: string | boolean // optional: determines whether the table displays the "table head"-sorts (defaults: true)
  sort?: string // optional: the only active sort to be applied to the table (defaults: '')
  sorts?: string | string[] // optional: the specific type of sorts to be applied to the table (defaults: [])
  filterable?: string | boolean // optional: determines whether the table displays the filters component (defaults: true)
  filters?: string | string[] // optional: the specific type of filters to be displayed/utilized in the table (defaults: [])
  filterValue?: any[]// optional: the specific type of filters to be displayed/utilized in the table (defaults: [])
  actionable?: string | boolean // optional: determines whether the table displays any "action items" (defaults: true)
  actions?: string | string[] // optional: the specific type of actions to be displayed/utilized in the table (defaults: 'Edit, Delete')
  perPage: number // optional: the number of rows (items) to be displayed per page (defaults: 10)
  /**
   * The current page number
   * @default 1
   * @type {number}
   * @memberof TableStore
   * @example 1
   */
  currentPage: number
  results?: SearchResponse<Record<string, any>> // optional: the Meilisearch search response (defaults: {})
  hits?: Hits // optional: the Meilisearch hits (we could also name this "rows" as that would be more applicable to the "table domain" but choosing to stay in sync with Meilisearch right now until we implement for a second search engine driver)
  selectable?: string | boolean // optional: determines whether the table displays the checkboxes (defaults: true)
  selectedRows?: number[] | string[] // optional: holds the selected rows (defaults: [])
  selectedAll?: boolean // optional: determines whether all the rows are selected (defaults: false)
  // stickyHeader?: string | boolean // optional: determines whether the table displays the sticky header (defaults: false)
  // stickyFooter?: string | boolean // optional: determines whether the table displays the sticky footer (defaults: false)
}
