import { isBoolean, isObject, isString, useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'

export function useTable(initialState?: TableStore) {
  const { search } = $(useSearch())
  const store = $(useStorage('table-store', initialState))

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
    if (!store)
      return

    store.currentPage--

    if (store.currentPage < 1)
      store.currentPage = 1

    search()
  }

  function goToNextPage() {
    if (!store)
      return

    store.currentPage++

    if (store.currentPage <= 1)
      store.currentPage = 1

    search()
  }

  return $$({
    initialState,
    store,
    isColumnSortable,
    goToPrevPage,
    goToNextPage,
  })
}
