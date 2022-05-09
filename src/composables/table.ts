import { isBoolean, isObject, isString, useStorage } from '@vueuse/core'
import type { TableStore } from '~/types'
// import type { TableOptions, TableStore } from '~/types'

export function useTable() {
  const initialData: TableStore = {
    source: '',
    type: '',
    columns: [],
    searchable: false,
    query: '',
    sortable: false,
    sorts: [],
    filterable: false,
    filters: [],
    actionable: false,
    actions: [],
    perPage: 20,
    currentPage: 1,
    // TODO: stickyHeader?: string | boolean
    // TODO: stickyFooter?: string | boolean
    results: {
      nbHits: 0,
      hits: [],
      offset: 0,
      limit: 20,
      processingTimeMs: 0,
      query: '',
      exhaustiveNbHits: false,
    },
  }

  const store = useStorage('table-store', initialData)

  function isColumnSortable(col: string): Boolean {
    if (isString(store.value.sorts) || isObject(store.value.sorts))
      return store.value.sorts.includes(col)
    else if (isBoolean(store.value.sortable))
      return store.value.sortable
    return false
  }

  function goToPrevPage() {
    store.value.currentPage--

    if (store.value.currentPage < 1)
      store.value.currentPage = 1

    search()
  }

  function goToNextPage() {
    store.value.currentPage++

    if (store.value.currentPage <= 1)
      store.value.currentPage = 1

    search()
  }

  // if (control)
  return $$({
    initialData,
    store,
    isColumnSortable,
    goToPrevPage,
    goToNextPage,
  })

  // return $$(store)
}
