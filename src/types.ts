export type TableRow = Record<string, unknown>
export type TableScalar = boolean | number | string | null
export type TableFilterValue = TableScalar | readonly TableScalar[]
export type TableFilters = Record<string, TableFilterValue>

export interface TableSearchRequest {
  index: string
  query?: string
  page?: number
  perPage?: number
  searchFields?: readonly string[]
  filters?: TableFilters
  facets?: readonly string[]
  sort?: readonly string[]
}

export interface TableSearchResult<Row extends TableRow = TableRow> {
  hits: Row[]
  total: number
  page: number
  perPage: number
  totalPages: number
  processingTimeMs?: number
  facets?: Record<string, Record<string, number>>
}

export interface TableRanking {
  rules: readonly string[]
}

export interface TableDriver<Row extends TableRow = TableRow> {
  readonly name: string
  search: (request: TableSearchRequest) => Promise<TableSearchResult<Row>>
  setRanking?: (index: string, ranking: TableRanking) => Promise<void>
}

export interface TableOptions<Row extends TableRow = TableRow> extends Omit<TableSearchRequest, 'index'> {
  index: string
  driver: TableDriver<Row>
  ranking?: TableRanking
}

export interface Table<Row extends TableRow = TableRow> {
  readonly driver: TableDriver<Row>
  readonly index: string
  readonly rankingReady: Promise<void>
  search: (request?: Omit<TableSearchRequest, 'index'>) => Promise<TableSearchResult<Row>>
}

export type TableFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
