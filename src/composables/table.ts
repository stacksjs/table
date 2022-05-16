import { isString, useStorage } from '@vueuse/core'
import MeiliSearch from 'meilisearch'
import type { Ref } from 'vue'
import type { TableStore } from '~/types'

// global table state
const table = $(useStorage('table', determineState()))

const results = $ref(table?.results)
const hits = $ref(results?.hits)
const columns = $ref(table?.columns)
const sort = $ref(table?.sort)
const sorts = $ref(table?.sorts)
const type = $ref(table?.type)
const currentPage = $ref(table?.currentPage)
const perPage = $ref(table?.perPage)
const query = $ref(table?.query)

const columnsExcludingLast = $computed(() => columns?.slice(0, -1))
const lastColumn = $computed(() => columns ? columns[columns.length - 1] : [])
const searchParams = $computed(() => {
  return {
    offset: (currentPage - 1) * perPage,
    limit: perPage,
    sort: ['name:asc'],
    // sort: isString(sort) ? [sort] : null,
  }
})

function determineState(state?: TableStore): TableStore {
  if (state !== undefined)
    return state

  const ls = localStorage.getItem('table')

  return ls ? JSON.parse(ls) : {}
}

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

// search methods
function client(apiKey = ''): MeiliSearch {
  // eslint-disable-next-line no-console
  console.log('table.source', table.source)
  return new MeiliSearch({
    host: table.source,
    apiKey,
  })
}

async function search(q?: string | Ref<string>) {
  try {
    q = isRef(q) ? unref(q) : q

    if (!isString(table.type)) // a lazy way to check if the table is loaded
      return

    // eslint-disable-next-line no-console
    console.log('is table set?', table)

    const query = isString(q) ? q : (table?.query ? table.query : '')
    const index = client().index(table.type)
    // eslint-disable-next-line no-console
    console.log('what is query', query)
    const results = await index.search(query)

    // eslint-disable-next-line no-console
    console.log('results', results)

    return results
  }
  catch (error) {
    console.error('error when performing search', error)
  }
}

export function useTable(store?: TableStore) {
  return $$({
    store,
    table: table ?? useStorage('table', determineState()),
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
    search,
    searchParams,
  })
}
