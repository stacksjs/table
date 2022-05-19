import { isObject, isString, useStorage } from '@vueuse/core'
import type { SearchResponse } from 'meilisearch'
import MeiliSearch from 'meilisearch'
import type { Ref } from 'vue'
import type { TableStore } from '~/types'

const table = $(useStorage('table', determineState()))

const results = $ref(table.results)
const hits = $ref(results)
const columns = $ref(table.columns)
const sort = $ref(table.sort)
const sorts = $ref(table.sorts)
const type = $ref(table.type)
const currentPage = $ref(table.currentPage)
const perPage = $ref(table.perPage)
const query = $ref(table.query)
const actions = $ref(table.actions)
const actionable = $ref(table.actionable)

const searchParams = $computed(() => {
  return {
    offset: (table.currentPage - 1) * table.perPage,
    limit: table.perPage,
    sort: isString(table.sort) ? [table.sort] : null,
  }
})

// let's debounce the search for 500ms
// this unfortunately triggers an initial "double search" scenario. Unsure if it persists beyond the initial "session"
watchEffect(async () => {
  // eslint-disable-next-line no-console
  console.log('watchEffect', query, searchParams)
  const results = await search(query, searchParams)

  if (results) {
    table.results = results
    table.hits = results.hits
  }
})

watchDebounced(
  query,
  () => {
    // eslint-disable-next-line no-console
    console.log('watchDebounced')

    if (table === undefined)
      return

    table.query = query
  },
  { debounce: 500 },
)

function determineState(): TableStore {
  const ls = localStorage.getItem('table')

  if (isString(ls))
    return JSON.parse(ls)

  // initial default state - overwrite with properties passed down from parent component
  const table: TableStore = {
    source: '',
    password: '',
    type: '',
    columns: [],
    perPage: 20,
    currentPage: 1,
    query: '',
  }

  return table
}

function isColumnSortable(col: string): Boolean {
  if (!hasTableLoaded(table))
    return false

  if (col === undefined)
    return false

  if (col.includes(':'))
    col = col.split(':')[0]

  if (table.sorts?.includes(col))
    return true

  return false
}

// search methods
function client(): MeiliSearch {
  // eslint-disable-next-line no-console
  console.log('table', table)

  if (!table.source)
    table.source = ''

  return new MeiliSearch({
    host: table.source, // http://3.85.80.143
    apiKey: table.password, // NtUvZv5Q87e355b807622149c350ac38679645b4e2603a1d3eb48cda080f977e76329aeb
  })
}

function hasTableLoaded(state?: any): Boolean {
  if (state?.type !== '')
    return true

  return isString(table?.type) && table.type !== '' // a lazy way to check if the table is loaded
}

async function search(q?: string, searchParams?: object): Promise<void | SearchResponse<Record<string, any>>> {
  // eslint-disable-next-line no-console
  console.log('searching', q, searchParams)
  if (!hasTableLoaded(table))
    return

  try {
    // if the query is provided as a param, it will trump what there would be otherwise in local storage
    const query = isString(q) ? q : (isString(table.query) ? table.query : '')

    if (!table.type) {
      // eslint-disable-next-line no-console
      console.error('no type provided')
      return
    }

    return await client().index(table.type).search(query, searchParams) // TODO: add search params (filters, sorts, etc)
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
}

function isColumnUsedAsSort(col: string | object) {
  let sortKey

  if (isObject(col))
    sortKey = col[0].includes(':') ? col[0].split(':')[0].trim() : col[0]

  else
    sortKey = col.includes(':') ? col.split(':')[0].trim() : col

  return table.sort?.includes(sortKey)
}

function toggleSort(col: string | Ref<string>) {
  if (isRef(col))
    col = unref(col)

  const sortKey = col.includes(':') ? col.split(':')[0].trim() : col

  // eslint-disable-next-line no-console
  console.log('col is', col)

  // eslint-disable-next-line no-console
  console.log('sortKey', sortKey)

  if (table.sort?.includes('asc')) {
    // eslint-disable-next-line no-console
    console.log('sort included asc it is now desc for', sortKey)

    table.sort = `${sortKey}:desc`
    return
  }

  if (table.sort?.includes('desc')) {
    // eslint-disable-next-line no-console
    console.log('sort included desc it is now "" for', sortKey)

    table.sort = ''
    return
  }

  if (table.sort === '') {
    // eslint-disable-next-line no-console
    console.log('sort included "" it is now asc for', sortKey)

    table.sort = `${sortKey}:asc`
    return
  }

  // eslint-disable-next-line no-console
  console.log('table.sort', table.sort)
}

export async function useTable(store?: TableStore) {
  return $$({
    store,
    table,
    type,
    columns,
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
    toggleSort,
    isColumnUsedAsSort,
    actionable,
    actions,
  })
}
