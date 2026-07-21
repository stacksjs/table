import { describe, expect, test } from 'bun:test'
import { createTable, MemoryTableDriver } from '../../src'

interface Product extends Record<string, unknown> {
  id: number
  name: string
  category: string
  price: number
}

describe('MemoryTableDriver', () => {
  const driver = new MemoryTableDriver<Product>({
    products: [
      { id: 1, name: 'Mechanical Keyboard', category: 'hardware', price: 149 },
      { id: 2, name: 'TypeScript Handbook', category: 'books', price: 39 },
      { id: 3, name: 'Wireless Keyboard', category: 'hardware', price: 89 },
      { id: 4, name: 'Monitor Arm', category: 'hardware', price: 129 },
    ],
  })

  test('searches, filters, ranks, paginates, and facets without a service', async () => {
    const table = createTable({
      driver,
      index: 'products',
      searchFields: ['name'],
      facets: ['category'],
      perPage: 1,
      ranking: { rules: ['price:asc'] },
    })

    const result = await table.search({
      query: 'keyboard',
      filters: { category: 'hardware' },
    })

    expect(result.hits).toEqual([
      { id: 3, name: 'Wireless Keyboard', category: 'hardware', price: 89 },
    ])
    expect(result.total).toBe(2)
    expect(result.totalPages).toBe(2)
    expect(result.facets).toEqual({ category: { hardware: 2 } })
  })

  test('supports explicit descending sorts and array filters', async () => {
    const result = await driver.search({
      index: 'products',
      filters: { category: ['hardware', 'books'] },
      sort: ['price:desc'],
      perPage: 2,
    })

    expect(result.hits.map(row => row.id)).toEqual([1, 4])
  })
})
