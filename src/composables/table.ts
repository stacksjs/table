import { isString, useStorage } from '@vueuse/core'
import MeiliSearch from 'meilisearch'
import type { TableStore } from '~/types'

const table = $(useStorage('table', determineState()))

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

export async function useTable(store?: TableStore) {
  const t = $ref(hasTableLoaded() ? table : determineState(store))

  const results = $ref(t.results)
  // eslint-disable-next-line no-console
  console.log('results', results)
  const hits = $ref(results?.hits)
  // eslint-disable-next-line no-console
  console.log('hits', hits)
  const columns = $ref(t.columns)
  const sort = $ref(t.sort)
  const sorts = $ref(t.sorts)
  const type = $ref(t.type)
  const currentPage = $ref(t.currentPage)
  const perPage = $ref(t.perPage)
  const query = $ref(t.query)

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

  function hasTableLoaded() {
    return isString(table.type) // a lazy way to check if the table is loaded
  }

  async function search(q: string): Promise<void> {
    try {
      if (!hasTableLoaded)
        return

      const query = isString(q) ? q : (table?.query ? table.query : '')
      // eslint-disable-next-line no-console
      console.log('query', query)
      const results = client().index('hoodratz').search('')

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
