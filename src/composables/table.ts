import { isString, useStorage } from '@vueuse/core'
import type { SearchResponse } from 'meilisearch'
import MeiliSearch from 'meilisearch'
import type { TableStore } from '~/types'

const table = $(useStorage('table', determineState()))

const results = $ref(table.results)
// eslint-disable-next-line no-console
console.log('results', results)
const hits = $ref(results?.hits)
// eslint-disable-next-line no-console
console.log('hits is', hits)
const columns = $ref(table.columns)
// eslint-disable-next-line no-console
console.log('columns', columns)
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

// eslint-disable-next-line no-console
console.log('table', table)

function determineState(state?: TableStore): TableStore {
  // eslint-disable-next-line no-console
  console.log('state', state)

  if (state !== undefined)
    return state

  const ls = localStorage.getItem('table')

  let table: TableStore = {
    source: '',
    type: '',
    columns: [''],
    columnsExcludingLast: [''],
    perPage: 20, // default to 20
    currentPage: 1,
  }

  // eslint-disable-next-line no-console
  console.log('ls', ls)

  if (isString(ls))
    table = JSON.parse(ls)

  return table
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

function hasTableLoaded(state?: any): Boolean {
  if (state?.type !== '')
    return true

  // eslint-disable-next-line no-console
  console.log('table?.type', table)

  return isString(table?.type) // a lazy way to check if the table is loaded
}

async function search(q = ''): Promise<void | SearchResponse<Record<string, any>>> {
  try {
    if (!hasTableLoaded(table))
      return

    const query = isString(q) ? q : (table?.query ? table.query : '')
    let results

    if (type)
      results = client().index(type).search(query) // TODO: add search params (filters, sorts, etc)

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

  await search() // TODO: add search params (filters, sorts, etc)
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

  await search() // TODO: add search params (filters, sorts, etc)
}

export async function useTable(store?: TableStore) {
  // if (hasTableLoaded() ? table : determineState(store))
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
