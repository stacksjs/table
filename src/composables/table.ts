import { isBoolean, isObject, isString } from '@vueuse/core'
import type { Ref } from 'vue'
import type { TableStore } from '~/types'

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
  results: {
    nbHits: 0,
    hits: [],
    offset: 0,
    limit: 20,
    processingTimeMs: 0,
    query: '',
    exhaustiveNbHits: false,
  },
  // TODO: stickyHeader?: string | boolean
  // TODO: stickyFooter?: string | boolean
}

export const tableStore: Ref<TableStore> = useStorage('table-store', initialData)

export async function goToPrevPage() {
  // eslint-disable-next-line no-console
  console.log('going to previous page')

  tableStore.value.currentPage--

  if (tableStore.value.currentPage < 1)
    tableStore.value.currentPage = 1

  await search()
}

export function goToNextPage() {
  // eslint-disable-next-line no-console
  console.log('going to next page')

  tableStore.value.currentPage++

  if (tableStore.value.currentPage <= 1)
    tableStore.value.currentPage = 1

  search()
}

export function isColumnSortable(col: string): Boolean {
  if (isString(tableStore.value.sorts) || isObject(tableStore.value.sorts))
    return tableStore.value.sorts.includes(col)
  else if (isBoolean(tableStore.value.sortable))
    return tableStore.value.sortable
  else
    return false
}
