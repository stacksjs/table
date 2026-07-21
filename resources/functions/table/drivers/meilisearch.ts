import { encodeIndex, positiveInteger, requestJson, trimTrailingSlash } from '../http'
import type { TableDriver, TableFetch, TableRanking, TableRow, TableSearchRequest, TableSearchResult } from '../types'

export interface MeilisearchTableDriverOptions {
  host?: string
  apiKey?: string
  fetch?: TableFetch
}

interface MeilisearchResponse<Row> {
  hits: Row[]
  estimatedTotalHits?: number
  totalHits?: number
  processingTimeMs?: number
  facetDistribution?: Record<string, Record<string, number>>
}

function meilisearchFilters(filters: TableSearchRequest['filters']): string[] {
  return Object.entries(filters ?? {}).map(([field, value]) => {
    const candidates = Array.isArray(value) ? value : [value]
    const encoded = candidates.map(candidate => `${field} = ${JSON.stringify(candidate)}`)
    return encoded.length === 1 ? encoded[0] : `(${encoded.join(' OR ')})`
  })
}

export class MeilisearchTableDriver<Row extends TableRow = TableRow> implements TableDriver<Row> {
  readonly name = 'meilisearch'
  readonly #host: string
  readonly #apiKey?: string
  readonly #fetch: TableFetch

  constructor(options: MeilisearchTableDriverOptions = {}) {
    this.#host = trimTrailingSlash(options.host ?? 'http://127.0.0.1:7700')
    this.#apiKey = options.apiKey
    this.#fetch = options.fetch ?? globalThis.fetch
  }

  async search(request: TableSearchRequest): Promise<TableSearchResult<Row>> {
    const page = positiveInteger(request.page, 1)
    const perPage = positiveInteger(request.perPage, 20)
    const response = await this.#request<MeilisearchResponse<Row>>(
      `/indexes/${encodeIndex(request.index)}/search`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: request.query ?? '',
          offset: (page - 1) * perPage,
          limit: perPage,
          attributesToSearchOn: request.searchFields,
          filter: meilisearchFilters(request.filters),
          facets: request.facets,
          sort: request.sort,
        }),
      },
    )
    const total = response.totalHits ?? response.estimatedTotalHits ?? response.hits.length

    return {
      hits: response.hits,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      processingTimeMs: response.processingTimeMs,
      facets: response.facetDistribution,
    }
  }

  async setRanking(index: string, ranking: TableRanking): Promise<void> {
    await this.#request(`/indexes/${encodeIndex(index)}/settings/ranking-rules`, {
      method: 'PATCH',
      body: JSON.stringify(ranking.rules),
    })
  }

  async #request<Result>(path: string, init: RequestInit): Promise<Result> {
    return requestJson<Result>(this.#fetch, `${this.#host}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.#apiKey ? { Authorization: `Bearer ${this.#apiKey}` } : {}),
        ...init.headers,
      },
    })
  }
}
