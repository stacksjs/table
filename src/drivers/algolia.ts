import { encodeIndex, positiveInteger, requestJson, trimTrailingSlash } from '../http'
import type { TableDriver, TableFetch, TableRanking, TableRow, TableSearchRequest, TableSearchResult } from '../types'

export interface AlgoliaTableDriverOptions {
  appId: string
  apiKey: string
  searchHost?: string
  writeHost?: string
  fetch?: TableFetch
}

interface AlgoliaResponse<Row> {
  hits: Row[]
  nbHits: number
  page: number
  hitsPerPage: number
  nbPages: number
  processingTimeMS?: number
  facets?: Record<string, Record<string, number>>
}

function facetFilters(filters: TableSearchRequest['filters']): Array<string | string[]> {
  return Object.entries(filters ?? {}).map(([field, value]) => {
    const candidates = Array.isArray(value) ? value : [value]
    const expressions = candidates.map(candidate => `${field}:${String(candidate)}`)
    return expressions.length === 1 ? expressions[0] : expressions
  })
}

export class AlgoliaTableDriver<Row extends TableRow = TableRow> implements TableDriver<Row> {
  readonly name = 'algolia'
  readonly #appId: string
  readonly #apiKey: string
  readonly #searchHost: string
  readonly #writeHost: string
  readonly #fetch: TableFetch

  constructor(options: AlgoliaTableDriverOptions) {
    this.#appId = options.appId
    this.#apiKey = options.apiKey
    this.#searchHost = trimTrailingSlash(options.searchHost ?? `https://${options.appId}-dsn.algolia.net`)
    this.#writeHost = trimTrailingSlash(options.writeHost ?? `https://${options.appId}.algolia.net`)
    this.#fetch = options.fetch ?? globalThis.fetch
  }

  async search(request: TableSearchRequest): Promise<TableSearchResult<Row>> {
    const page = positiveInteger(request.page, 1)
    const perPage = positiveInteger(request.perPage, 20)
    const response = await this.#request<AlgoliaResponse<Row>>(
      this.#searchHost,
      `/1/indexes/${encodeIndex(request.index)}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          query: request.query ?? '',
          page: page - 1,
          hitsPerPage: perPage,
          restrictSearchableAttributes: request.searchFields,
          facetFilters: facetFilters(request.filters),
          facets: request.facets,
        }),
      },
    )

    return {
      hits: response.hits,
      total: response.nbHits,
      page: response.page + 1,
      perPage: response.hitsPerPage,
      totalPages: Math.max(1, response.nbPages),
      processingTimeMs: response.processingTimeMS,
      facets: response.facets,
    }
  }

  async setRanking(index: string, ranking: TableRanking): Promise<void> {
    await this.#request(this.#writeHost, `/1/indexes/${encodeIndex(index)}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ customRanking: ranking.rules }),
    })
  }

  async #request<Result>(host: string, path: string, init: RequestInit): Promise<Result> {
    return requestJson<Result>(this.#fetch, `${host}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': this.#apiKey,
        'X-Algolia-Application-Id': this.#appId,
        ...init.headers,
      },
    })
  }
}
