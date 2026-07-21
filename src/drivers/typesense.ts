import { encodeIndex, positiveInteger, requestJson, trimTrailingSlash } from '../http'
import type { TableDriver, TableFetch, TableRow, TableSearchRequest, TableSearchResult } from '../types'

export interface TypesenseTableDriverOptions {
  host?: string
  apiKey: string
  queryBy: readonly string[]
  fetch?: TableFetch
}

interface TypesenseResponse<Row> {
  found: number
  page: number
  search_time_ms?: number
  hits: Array<{ document: Row }>
  facet_counts?: Array<{ field_name: string, counts: Array<{ value: string, count: number }> }>
}

function typesenseFilter(filters: TableSearchRequest['filters']): string | undefined {
  const expressions = Object.entries(filters ?? {}).map(([field, value]) => {
    const candidates = Array.isArray(value) ? value : [value]
    return candidates.length === 1
      ? `${field}:=${JSON.stringify(candidates[0])}`
      : `${field}:=[${candidates.map(candidate => JSON.stringify(candidate)).join(',')}]`
  })
  return expressions.length ? expressions.join(' && ') : undefined
}

export class TypesenseTableDriver<Row extends TableRow = TableRow> implements TableDriver<Row> {
  readonly name = 'typesense'
  readonly #host: string
  readonly #apiKey: string
  readonly #queryBy: readonly string[]
  readonly #fetch: TableFetch

  constructor(options: TypesenseTableDriverOptions) {
    this.#host = trimTrailingSlash(options.host ?? 'http://127.0.0.1:8108')
    this.#apiKey = options.apiKey
    this.#queryBy = options.queryBy
    this.#fetch = options.fetch ?? globalThis.fetch
  }

  async search(request: TableSearchRequest): Promise<TableSearchResult<Row>> {
    const page = positiveInteger(request.page, 1)
    const perPage = positiveInteger(request.perPage, 20)
    const params = new URLSearchParams({
      q: request.query || '*',
      query_by: (request.searchFields?.length ? request.searchFields : this.#queryBy).join(','),
      page: String(page),
      per_page: String(perPage),
    })
    const filterBy = typesenseFilter(request.filters)
    if (filterBy)
      params.set('filter_by', filterBy)
    if (request.facets?.length)
      params.set('facet_by', request.facets.join(','))
    if (request.sort?.length)
      params.set('sort_by', request.sort.join(','))

    const response = await requestJson<TypesenseResponse<Row>>(
      this.#fetch,
      `${this.#host}/collections/${encodeIndex(request.index)}/documents/search?${params}`,
      { headers: { 'X-TYPESENSE-API-KEY': this.#apiKey } },
    )
    const facets = Object.fromEntries((response.facet_counts ?? []).map(facet => [
      facet.field_name,
      Object.fromEntries(facet.counts.map(count => [count.value, count.count])),
    ]))

    return {
      hits: response.hits.map(hit => hit.document),
      total: response.found,
      page: response.page,
      perPage,
      totalPages: Math.max(1, Math.ceil(response.found / perPage)),
      processingTimeMs: response.search_time_ms,
      facets: Object.keys(facets).length ? facets : undefined,
    }
  }
}
