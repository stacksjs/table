import { positiveInteger } from '../http'
import type { TableDriver, TableFilterValue, TableRanking, TableRow, TableSearchRequest, TableSearchResult } from '../types'

function valuesMatch(value: unknown, expected: TableFilterValue): boolean {
  const candidates = Array.isArray(expected) ? expected : [expected]
  return candidates.some(candidate => Object.is(value, candidate))
}

function searchableValue(value: unknown): string {
  if (value === null || value === undefined)
    return ''
  if (typeof value === 'object')
    return JSON.stringify(value)
  return String(value)
}

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number')
    return left - right

  return searchableValue(left).localeCompare(searchableValue(right), undefined, { numeric: true })
}

export class MemoryTableDriver<Row extends TableRow = TableRow> implements TableDriver<Row> {
  readonly name = 'memory'
  readonly #indexes = new Map<string, Row[]>()
  readonly #ranking = new Map<string, readonly string[]>()

  constructor(indexes: Record<string, readonly Row[]> = {}) {
    for (const [index, rows] of Object.entries(indexes))
      this.seed(index, rows)
  }

  seed(index: string, rows: readonly Row[]): void {
    this.#indexes.set(index, rows.map(row => ({ ...row })))
  }

  async setRanking(index: string, ranking: TableRanking): Promise<void> {
    this.#ranking.set(index, [...ranking.rules])
  }

  async search(request: TableSearchRequest): Promise<TableSearchResult<Row>> {
    const startedAt = performance.now()
    const page = positiveInteger(request.page, 1)
    const perPage = positiveInteger(request.perPage, 20)
    const query = request.query?.trim().toLocaleLowerCase() ?? ''
    const filters = Object.entries(request.filters ?? {})
    const source = this.#indexes.get(request.index) ?? []

    let rows = source.filter((row) => {
      if (filters.some(([field, expected]) => !valuesMatch(row[field], expected)))
        return false

      if (!query)
        return true

      const fields = request.searchFields?.length ? request.searchFields : Object.keys(row)
      return fields.some(field => searchableValue(row[field]).toLocaleLowerCase().includes(query))
    })

    const sorts = request.sort?.length ? request.sort : this.#ranking.get(request.index) ?? []
    for (const expression of [...sorts].reverse()) {
      const [field, direction = 'asc'] = expression.split(':')
      rows = rows.toSorted((left, right) => {
        const comparison = compareValues(left[field], right[field])
        return direction.toLocaleLowerCase() === 'desc' ? -comparison : comparison
      })
    }

    const facets: Record<string, Record<string, number>> = {}
    for (const field of request.facets ?? []) {
      const counts: Record<string, number> = {}
      for (const row of rows) {
        const value = searchableValue(row[field])
        counts[value] = (counts[value] ?? 0) + 1
      }
      facets[field] = counts
    }

    const total = rows.length
    const offset = (page - 1) * perPage
    return {
      hits: rows.slice(offset, offset + perPage),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      processingTimeMs: performance.now() - startedAt,
      facets: Object.keys(facets).length ? facets : undefined,
    }
  }
}
