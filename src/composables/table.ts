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
const sortOrders = $ref([])
const type = $ref(table.type)
const currentPage = $ref(table.currentPage)
const perPage = $ref(table.perPage)
const query = $ref(table.query)
const actions = $ref(table.actions)
const actionable = $ref(table.actionable)

const searchParams = $computed(() => {
  return {
    offset: (currentPage - 1) * perPage,
    limit: perPage,
    sort: ['name:asc'],
    // sort: isString(sort) ? [sort] : null,
  }
})

function determineState(): TableStore {
  const ls = localStorage.getItem('table')

  // initial default state
  let table: TableStore = {
    source: '',
    type: '',
    columns: [],
    perPage: 20, // default to 20
    currentPage: 1,
  }

  if (isString(ls))
    table = JSON.parse(ls)

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
  return new MeiliSearch({
    host: 'http://3.85.80.143',
    apiKey: 'NtUvZv5Q87e355b807622149c350ac38679645b4e2603a1d3eb48cda080f977e76329aeb',
  })
}

function hasTableLoaded(state?: any): Boolean {
  if (state?.type !== '')
    return true

  return isString(table?.type) && table.type !== '' // a lazy way to check if the table is loaded
}

async function search(q = '', searchParams = {}): Promise<void | SearchResponse<Record<string, any>>> {
  // eslint-disable-next-line no-console
  console.log('searchParams', searchParams)

  if (!hasTableLoaded(table))
    return

  try {
    const query = isString(q) ? q : (table?.query ? table.query : '')

    return await client().index(table.type).search(query) // TODO: add search params (filters, sorts, etc)
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

function isColumnUsedAsSort(col: string | object) {
  let k

  if (isObject(col))
    k = col[0].includes(':') ? col[0].split(':')[0].trim() : col[0]

  else
    k = col.includes(':') ? col.split(':')[0].trim() : col

  return sortOrders[k]
}

function toggleSort(col: string | Ref<string>) {
  if (isRef(col))
    col = unref(col)

  const k = col.includes(':') ? col.split(':')[0].trim() : col
  sortOrders[k] = !sortOrders[k]
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
    sortOrders,
    toggleSort,
    isColumnUsedAsSort,
    actionable,
    actions,
  })
}
