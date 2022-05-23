import { isObject, isString, useStorage } from '@vueuse/core'
import type { SearchResponse } from 'meilisearch'
import MeiliSearch from 'meilisearch'
import type { Ref } from 'vue'
import type { TableStore } from '~/types'

const table = $(useStorage('table', determineState()))

const results = $ref(table.results)
const hits = $ref(results?.hits)
const columns = $ref(table.columns)
const filters = $ref(table.filters)
const sort = $ref(table.sort)
const sorts = $ref(table.sorts)
const type = $ref(table.type)
const currentPage = $ref(table.currentPage)
const perPage = $ref(table.perPage)
const query = $ref(table.query)
const actions = $ref(table.actions)
const actionable = $ref(table.actionable)
const selectedHits: number[] = $ref([]) // aka selectedRows
const checked = $ref(false)

// const parsedFilters = $computed(() => {
//   let parsed: string[] = []

//   if (filters === undefined || !filters.length)
//     return []

//   if (isString(filters))
//     parsed = filters.split(',')

//   return parsed.map((filter) => {
//     const [key, value] = filter.split(':')

//     return {
//       key,
//       value,
//     }
//   })
// })
const totalPages = $computed(() => Math.ceil(table.results?.nbHits ?? 1 / table.perPage))
const indeterminate = $computed(() => selectedHits.length > 0 && selectedHits.length < hits.length)
const searchParams = $computed(() => {
  return {
    offset: (table.currentPage - 1) * table.perPage,
    limit: table.perPage,
    sort: isString(table.sort) ? [table.sort] : null,
  }
})
const lastColumn = $computed(() => {
  if (table.actionable || table.actions?.length)
    return [''] // actions-columns have no table-head

  return table.columns[table.columns.length - 1]
})
const readableLastColumn = $computed(() => lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[1].trim() : lastColumn[0])
const lastPageNumber = $computed(() => Math.ceil((table.results?.nbHits ?? 1) / table.perPage))

// this watchEffect picks up any reactivity changes from `query` and `searchParams` and it will then trigger a search
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

watch(selectedHits, (oldValue, newValue) => {
  // eslint-disable-next-line no-console
  console.log('selectedHits oldValue, newValue', oldValue, newValue)
})

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
    host: table.source, // http://3.85.80.143
    apiKey: table.password, // NtUvZv5Q87e355b807622149c350ac38679645b4e2603a1d3eb48cda080f977e76329aeb
  })
}

function hasTableLoaded(state?: any): Boolean {
  if (state?.type !== '')
    return true

  return isString(table?.type) && table.type !== '' // a lazy way to check if the table is loaded
}

// we have to accept the query and searchParams because those params are watched in the watchEffect
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

function goToPrevPage() {
  if (table.currentPage === 1 || currentPage === undefined || table === undefined)
    return

  table.currentPage--

  if (currentPage < 1)
    table.currentPage = 1
}

function goToNextPage() {
  // eslint-disable-next-line no-console
  console.log('currentPage before going to next page', currentPage)

  if (table.currentPage === totalPages || currentPage === undefined || table === undefined)
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

  const sortKey = col.includes(':') ? col.split(':')[0].trim() : col

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

function colName(col: string) {
  return col.split(':')[0].trim()
}

export async function useTable(store?: TableStore) {
  return $$({
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
    colName,
    selectedHits,
    checked,
    indeterminate,
    lastColumn,
    readableLastColumn,
    lastPageNumber,
  })
}
