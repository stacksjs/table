import { isObject, isString, useStorage } from '@vueuse/core'
import type { SearchParams } from 'meilisearch'
import type { TableStore } from '~/types'

export function useTable(initialState?: TableStore) {
  // eslint-disable-next-line no-console
  console.log('useTable is triggered with initialState of:', initialState, typeof initialState)
  let state = initialState

  // in case the initial state is not provided
  if (state === undefined) {
    // eslint-disable-next-line no-console
    console.log('state is undefined so localStorage should have data')
    const ls = localStorage.getItem('table')
    state = isObject(ls) ? JSON.parse(ls) : {}
  }

  // here, we need to either set the "initial state" or the "current state" from localStorage
  const table = $(useStorage('table', state))
  const { search } = $(useSearch())

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

  const sort = $computed({
    get: () => table?.sort,
    set: (val) => {
      if (table?.sort && val)
        table.sort = val
    },
  })

  const sorts = $computed({
    get: () => table?.sorts,
    set: (val) => {
      if (table?.sorts && val)
        table.sorts = val
    },
  })

  const type = $computed(() => table?.type || '')
  const columnsExcludingLast = $computed(() => table?.columns?.slice(0, -1))
  const lastColumn = $computed(() => table?.columns ? table.columns[table.columns.length - 1] : [])
  const currentPage = $computed(() => table?.currentPage || 1)
  const perPage = $computed(() => table?.perPage || 20)
  const query = $computed(() => table?.query || '')

  const searchParams: SearchParams = $computed(() => {
    return {
      offset: (currentPage - 1) * perPage,
      limit: perPage,
      sort: isString(sort) ? [sort] : [''],
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
    state,
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
