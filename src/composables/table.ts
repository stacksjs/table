import { isBoolean, isObject, isString, useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'

export function useTable(initialState?: TableStore) {
  const { search } = $(useSearch())
  const table = $(useStorage('table-table', initialState))

  // eslint-disable-next-line no-console
  console.log('table?.columns', table?.columns)

  const results = $computed({
    get: () => table?.results,
    set: (val) => {
      if (table)
        table.results = val
    },
  })

  const hits = $computed({
    get: () => table?.results?.hits,
    set: (val) => {
      if (table?.results?.hits && val)
        table.results.hits = val
    },
  })

  const columns = $computed({
    get: () => table?.columns,
    set: (val) => {
      if (table?.columns && val)
        table.columns = val
    },
  })

  const sorts = $computed({
    get: () => table?.sorts,
    set: (val) => {
      if (table?.sorts && val)
        table.sorts = val
    },
  })

  const columnsExcludingLast = $computed(() => table?.columns?.slice(0, -1))
  const lastColumn = $computed(() => table?.columns ? table.columns[table.columns.length - 1] : [])
  // eslint-disable-next-line no-console
  console.log('lastColumn', lastColumn)
  const currentPage = $computed(() => table?.currentPage || 1)
  const perPage = $computed(() => table?.perPage || 20)
  const query = $computed(() => table?.query || '')
  const type = $computed(() => table?.type || '')

  function isColumnSortable(col: string): Boolean {
    if (isString(table?.sorts) || isObject(table?.sorts)) {
      if (!table)
        return false
      return table.sorts.includes(col)
    }

    else if (isBoolean(table?.sortable)) {
      if (!table)
        return false
      return table.sortable
    }

    return false
  }

  function goToPrevPage() {
    if (currentPage === undefined || table === undefined)
      return

    table.currentPage--

    if (currentPage < 1)
      table.currentPage = 1

    search()
  }

  function goToNextPage() {
    if (currentPage === undefined || table === undefined)
      return

    table.currentPage++

    if (table.currentPage <= 1)
      table.currentPage = 1

    search()
  }

  return $$({
    initialState,
    table,
    type,
    columns,
    columnsExcludingLast,
    lastColumn,
    isColumnSortable,
    sorts,
    query,
    results,
    hits,
    perPage,
    currentPage,
    goToPrevPage,
    goToNextPage,
  })
}
