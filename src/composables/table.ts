import { isObject, isString, useStorage } from '@vueuse/core'
import type { SearchParams, SearchResponse } from 'meilisearch'
import MeiliSearch from 'meilisearch'
import type { Ref } from 'vue'
import { computed } from 'vue-demi'
import type { TableStore } from '~/types'

const table = (useStorage('table', determineState()).value as TableStore)

const results = computed(() => table.results)
const hits = computed(() => results.value?.hits || [])
const columns = computed(() => table.columns)
const filters = computed(() => table.filters)
const sort = computed(() => table.sort)
const sorts = computed(() => table.sorts)
const type = computed(() => table.type)
const currentPage = computed(() => table.currentPage)
const perPage = computed(() => table.perPage)
const query = computed(() => table.query)
const actions = computed(() => table.actions)
const actionable = computed(() => table.actionable)
const selectedRows = computed(() => table.selectedRows)
const selectedAll = computed(() => table.selectedAll)
const searchParams = computed(() => {
  return {
    offset: (table.currentPage - 1) * table.perPage,
    limit: table.perPage,
    sort: isString(table.sort) ? [table.sort] : undefined,
  }
})
const totalPages = computed(() => Math.ceil(table.results?.nbHits ?? 1 / table.perPage))
const pages = computed(() => [...Array(totalPages).keys()].map(i => i + 1))

const indeterminate = computed(() => (table?.selectedRows?.length ?? 0) > 0 && (table?.selectedRows?.length ?? 0) < hits.value.length)
const lastColumn = computed(() => {
  if (table.actionable || table.actions?.length)
    return [''] // actions-columns have no table-head

  return table.columns[table.columns.length - 1]
})
const readableLastColumn = computed(() => lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[1].trim() : lastColumn[0])
const lastPageNumber = computed(() => Math.ceil((table.results?.nbHits ?? 1) / table.perPage))

// this watchEffect picks up any reactivity changes from `query` and `searchParams` and it will then trigger a search
watchEffect(async () => {
  // eslint-disable-next-line no-console
  console.log('watchEffect', query, searchParams)

  const results = await search(query.value, searchParams.value)

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

    if (isRef(table.query))
      table.query = query.value
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
    filters: [],
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
    host: table.source,
    apiKey: table.password,
  })
}

function hasTableLoaded(state?: any): Boolean {
  if (state?.type !== '')
    return true

  return isString(table?.type) && table.type !== '' // a lazy way to check if the table is loaded
}

// we have to accept `query` and `searchParams` because those params are watched from within a watchEffect
async function search(q?: string, options?: SearchParams): Promise<void | SearchResponse<Record<string, any>>> {
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

    // we w
    if (options === undefined)
      return await client().index(table.type).search(query, searchParams.value)

    return await client().index(table.type).search(query, options)
  }
  catch (error) {
    console.error('error when performing search', error)
  }
}

function goToPrevPage() {
  if (table.currentPage === 1 || currentPage === undefined || table === undefined)
    return

  table.currentPage--

  if (currentPage.value < 1)
    table.currentPage = 1
}

function goToNextPage() {
  // eslint-disable-next-line no-console
  console.log('currentPage before going to next page', currentPage)

  if (table.currentPage === totalPages.value || currentPage === undefined || table === undefined)
    return

  if (table.currentPage < 1)
    table.currentPage = 1
  else
    table.currentPage++
}

function goToPage(page: number) {
  // eslint-disable-next-line no-console
  console.log('currentPage', currentPage)

  if (table.currentPage === page || currentPage === undefined || table === undefined)
    return

  if (table.currentPage <= 1)
    table.currentPage = 1

  table.currentPage = page
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

  const sortKey = (col as string).includes(':') ? (col as string).split(':')[0].trim() : col

  if (table.sort?.includes('desc')) {
    table.sort = `${sortKey}:asc`

    // eslint-disable-next-line no-console
    console.log('sort included asc it is now desc for', sortKey)

    return
  }

  if (table.sort?.includes('asc')) {
    table.sort = undefined

    // eslint-disable-next-line no-console
    console.log('sort included desc it is now "" for', sortKey)

    return
  }

  // eslint-disable-next-line no-console
  console.log('there was no sort. Setting it now in asc order for', sortKey)

  table.sort = `${sortKey}:desc`

  // eslint-disable-next-line no-console
  console.log('table.sort', table.sort)
}

function columnName(col: string) {
  return col.split(':')[0].trim()
}

export async function useTable(store?: TableStore) {
  return {
    store,
    table,
    type,
    columns,
    isColumnSortable,
    filters,
    sort,
    sorts,
    query,
    results,
    hits,
    perPage,
    currentPage,
    goToPrevPage,
    goToNextPage,
    goToPage,
    search,
    searchParams,
    toggleSort,
    isColumnUsedAsSort,
    actionable,
    actions,
    columnName,
    indeterminate,
    lastColumn,
    readableLastColumn,
    lastPageNumber,
    selectedRows,
    selectedAll,
    totalPages,
    pages,
  }
}
