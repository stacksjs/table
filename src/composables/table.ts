import { isString, useStorage } from '@vueuse/core'
import MeiliSearch from 'meilisearch'
import type { Ref } from 'vue'
import type { TableStore } from '~/types'

export function useTable(store?: TableStore) {
  const table = $(useStorage('table', determineState(store)))

  const results = $ref(table.results)
  const hits = $ref(results?.hits)
  const columns = $ref(table.columns)
  const sort = $ref(table.sort)
  const sorts = $ref(table.sorts)
  const type = $ref(table.type)
  const currentPage = $ref(table.currentPage)
  const perPage = $ref(table.perPage)
  const query = $ref(table.query)

  const columnsExcludingLast = $computed(() => columns?.slice(0, -1))
  const lastColumn = $computed(() => columns ? [columns[columns.length - 1]] : [])
  const readableLastColumn = $computed(() => lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[1].trim() : lastColumn[0])
  const searchParams = $computed(() => {
    return {
      offset: (currentPage - 1) * perPage,
      limit: perPage,
      sort: ['name:asc'],
    // sort: isString(sort) ? [sort] : null,
    }
  })

  function determineState(state?: TableStore): TableStore {
  // eslint-disable-next-line no-console
    console.log('state', state)
    if (state !== undefined)
      return state

    // eslint-disable-next-line no-console
    console.log('here?')

    const ls = localStorage.getItem('table')

    return ls ? JSON.parse(ls) : {}
  }

  function isColumnSortable(col: string): Boolean {
    if (!table?.type)
      return false

    if (col.includes(':'))
      col = col.split(':')[0]

    if (table.sorts?.includes(col))
      return true

    return false
  }

  // search methods
  function client(apiKey = ''): MeiliSearch {
  // eslint-disable-next-line no-console
    console.log('table.source', table.source)
    return new MeiliSearch({
      host: 'http://127.0.0.1:7700',
      apiKey,
    })
  }

  async function search(q?: string | Ref<string>) {
    try {
      if (!isString(table.type)) // a lazy way to check if the table is loaded
        return

      q = isRef(q) ? unref(q) : q

      const query = isString(q) ? q : (table?.query ? table.query : '')
      // eslint-disable-next-line no-console
      console.log('query', query)
      const results = await client().index('hoodratz').search('')

      // eslint-disable-next-line no-console
      console.log('results', results)

      return results
    }
    catch (error) {
      console.error('error when performing search', error)
    }
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
  // eslint-disable-next-line no-console
    console.log('currentPage', currentPage)

    if (currentPage === undefined || table === undefined)
      return

    table.currentPage++

    // eslint-disable-next-line no-console
    console.log('currentPage after adding?', currentPage)

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
    readableLastColumn,
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
    search,
    searchParams,
  })
}
