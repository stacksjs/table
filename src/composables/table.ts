import { isBoolean, isObject, isString, useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'

export function useTable(initialState?: TableStore) {
  const { search } = $(useSearch())
  const store = $(useStorage('table-store', initialState))

  const results = store?.results
  const hits = store?.results?.hits
  const columns = store?.columns
  const sorts = store?.sorts
  const columnsExcludingLast = store?.columns?.slice(0, -1)
  const lastColumn = store?.columns ? store.columns[store.columns.length - 1] : []
  const currentPage = store?.currentPage || 1
  const perPage = store?.perPage || 20

  function isColumnSortable(col: string): Boolean {
    if (isString(store?.sorts) || isObject(store?.sorts)) {
      if (!store)
        return false
      return store.sorts.includes(col)
    }

    else if (isBoolean(store?.sortable)) {
      if (!store)
        return false
      return store.sortable
    }

    return false
  }

  function goToPrevPage() {
    if (currentPage === undefined || store === undefined)
      return

    store.currentPage--

    if (currentPage < 1)
      store.currentPage = 1

    search()
  }

  function goToNextPage() {
    if (currentPage === undefined || store === undefined)
      return

    store.currentPage++

    if (store.currentPage <= 1)
      store.currentPage = 1

    search()
  }

  return $$({
    initialState,
    store,
    columns,
    columnsExcludingLast,
    lastColumn,
    isColumnSortable,
    sorts,
    results,
    hits,
    perPage,
    currentPage,
    goToPrevPage,
    goToNextPage,
  })
}
