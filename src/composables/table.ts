import { isBoolean, isObject, isString, useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'

export async function useTable(initialState?: TableStore) {
  const { search } = $(useSearch())
  const store = $(useStorage('table-store', initialState))

  await search()

  const results = $computed({
    get: () => store?.results,
    set: (val) => {
      if (store)
        store.results = val
    },
  })

  const hits = $computed({
    get: () => store?.results?.hits,
    set: (val) => {
      if (store?.results?.hits && val)
        store.results.hits = val
    },
  })

  const columns = $computed({
    get: () => store?.columns,
    set: (val) => {
      if (store?.columns && val)
        store.columns = val
    },
  })

  const sorts = $computed({
    get: () => store?.sorts,
    set: (val) => {
      if (store?.sorts && val)
        store.sorts = val
    },
  })

  const columnsExcludingLast = $computed(() => store?.columns?.slice(0, -1))
  const lastColumn = $computed(() => store?.columns ? store.columns[store.columns.length - 1] : [])
  const currentPage = $computed(() => store?.currentPage || 1)
  const perPage = $computed(() => store?.perPage || 20)

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
