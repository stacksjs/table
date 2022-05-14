import { useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'

// global table state
const { search } = $(useSearch())

export function useTable(store?: TableStore) {
  // here, we need to either set the "initial state" or the "current state" from localStorage
  // eslint-disable-next-line prefer-const
  let table = $(useStorage('table', determineState(store)))
  const results = $ref(table?.results)
  const hits = $ref(results?.hits)
  const columns = $ref(table?.columns)
  const sort = $ref(table?.sort)
  const sorts = $ref(table?.sorts)
  const type = $ref(table?.type || '')
  const columnsExcludingLast = $computed(() => columns.slice(0, -1))
  const lastColumn = $computed(() => columns ? columns[columns.length - 1] : [])
  const currentPage = $ref(table?.currentPage || 1)
  const perPage = $ref(table?.perPage || 20)
  const query = $ref(table?.query || '')
  const searchParams = $computed(() => {
    return {
      offset: (currentPage - 1) * perPage,
      limit: perPage,
      sort: ['name:asc'],
      // sort: isString(sort) ? [sort] : null,
    }
  })

  function isColumnSortable(col: string): Boolean {
    if (table === undefined)
      return false

    if (col.includes(':'))
      col = col.split(':')[0]

    if (table.sorts?.includes(col))
      return true

    return false
  }

  async function goToPrevPage() {
    if (currentPage === undefined || table === undefined)
      return

    table.currentPage--

    if (currentPage < 1)
      table.currentPage = 1

    await search()
  }

  async function goToNextPage() {
    if (currentPage === undefined || table === undefined)
      return

    table.currentPage++

    if (table.currentPage <= 1)
      table.currentPage = 1

    await search()
  }

  return $$({
    store,
    table,
    type,
    columns,
    columnsExcludingLast,
    lastColumn,
    isColumnSortable,
    sort,
    sorts,
    query,
    results,
    hits,
    perPage,
    currentPage,
    goToPrevPage,
    goToNextPage,
    searchParams,
  })
}

function determineState(state?: TableStore): TableStore {
  if (state !== undefined)
    return state

  const ls = localStorage.getItem('table')

  return ls ? JSON.parse(ls) : {}
}
