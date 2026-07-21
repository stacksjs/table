import { describe, expect, test } from 'bun:test'
import { AlgoliaTableDriver, createTable, MeilisearchTableDriver, TypesenseTableDriver } from '../../src'
import type { TableFetch } from '../../src'

interface Call {
  url: string
  init?: RequestInit
}

function response(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('remote table drivers', () => {
  test('maps Meilisearch requests and applies ranking once before search', async () => {
    const calls: Call[] = []
    const fetcher: TableFetch = async (input, init) => {
      calls.push({ url: String(input), init })
      if (String(input).endsWith('/settings/ranking-rules'))
        return response({ taskUid: 1 })
      return response({ hits: [{ id: 1 }], estimatedTotalHits: 1, processingTimeMs: 2 })
    }
    const table = createTable({
      driver: new MeilisearchTableDriver({ host: 'https://search.test/', apiKey: 'secret', fetch: fetcher }),
      index: 'products',
      ranking: { rules: ['sort', 'words'] },
    })

    const result = await table.search({ query: 'keyboard', page: 2, perPage: 10 })

    expect(result.hits).toEqual([{ id: 1 }])
    expect(calls.map(call => call.url)).toEqual([
      'https://search.test/indexes/products/settings/ranking-rules',
      'https://search.test/indexes/products/search',
    ])
    expect(JSON.parse(String(calls[1].init?.body))).toMatchObject({ q: 'keyboard', offset: 10, limit: 10 })
  })

  test('uses Algolia search and write hosts for their intended operations', async () => {
    const calls: Call[] = []
    const fetcher: TableFetch = async (input, init) => {
      calls.push({ url: String(input), init })
      if (String(input).endsWith('/settings'))
        return response({ updatedAt: 'now' })
      return response({ hits: [{ id: 1 }], nbHits: 1, page: 0, hitsPerPage: 20, nbPages: 1 })
    }
    const table = createTable({
      driver: new AlgoliaTableDriver({ appId: 'APP', apiKey: 'secret', fetch: fetcher }),
      index: 'products',
      ranking: { rules: ['desc(popularity)'] },
    })

    await table.search({ filters: { category: ['hardware', 'books'] } })

    expect(calls[0].url).toBe('https://APP.algolia.net/1/indexes/products/settings')
    expect(calls[1].url).toBe('https://APP-dsn.algolia.net/1/indexes/products/query')
    expect(JSON.parse(String(calls[1].init?.body)).facetFilters).toEqual([
      ['category:hardware', 'category:books'],
    ])
  })

  test('maps Typesense documents, facets, filtering, and sorting', async () => {
    let requestUrl = ''
    const fetcher: TableFetch = async (input) => {
      requestUrl = String(input)
      return response({
        found: 1,
        page: 1,
        hits: [{ document: { id: '1', name: 'Keyboard' } }],
        facet_counts: [{ field_name: 'category', counts: [{ value: 'hardware', count: 1 }] }],
      })
    }
    const driver = new TypesenseTableDriver({
      host: 'https://typesense.test/',
      apiKey: 'secret',
      queryBy: ['name'],
      fetch: fetcher,
    })

    const result = await driver.search({
      index: 'products',
      query: 'keyboard',
      filters: { category: 'hardware' },
      facets: ['category'],
      sort: ['price:desc'],
    })

    expect(result.hits).toEqual([{ id: '1', name: 'Keyboard' }])
    expect(result.facets).toEqual({ category: { hardware: 1 } })
    expect(requestUrl).toContain('query_by=name')
    expect(requestUrl).toContain('filter_by=category%3A%3D%22hardware%22')
    expect(requestUrl).toContain('sort_by=price%3Adesc')
  })
})
