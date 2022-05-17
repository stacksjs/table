<script setup lang="ts">
import { isString } from '@vueuse/core'
import { useTable } from '~/composables/table'

interface Props {
  source?: string
  type: string
  columns: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string | boolean
  sort?: string // TODO: we could validate for whether :asd or :desc is used, or if not provided, default to asc (or desc?)
  sorts?: string | string[]
  filterable?: string | boolean
  filters?: string | string[]
  actionable?: string | boolean
  actions?: string | string[]
  perPage?: string | number
  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean
}

const {
  source = 'http://127.0.0.1:7700',
  type,
  columns,
  searchable = true,
  query,
  filters = [],
  filterable = true,
  sort = '',
  sorts = [],
  sortable = true,
  perPage = 20,
  actions = [],
  actionable = false,
} = defineProps<Props>()

const cols = $computed((): string[] => {
  if (isString(columns))
    return columns.split(',').map(col => col.trim())

  return columns
})

const sortDirections = $computed((): string[] => {
  if (isString(sorts))
    return sorts.split(',').map(col => col.trim())

  return sorts
})
const facetFilters = $computed((): string[] => {
  if (isString(filters))
    return filters.split(',').map(col => col.trim())

  return filters
})
const itemsPerPage = $computed((): number => {
  if (isString(perPage))
    return parseInt(perPage)

  return perPage
})

// eslint-disable-next-line no-console
console.log('initializing table')

// let's use (init) the table by passing the default state
const { table, search, query: q } = await useTable({
  source,
  type,
  columns: cols,
  searchable,
  query,
  filters: facetFilters,
  filterable,
  sort,
  sorts: sortDirections,
  sortable,
  actions,
  actionable,
  perPage: itemsPerPage,
  currentPage: 1,
})

// let's run the initial search upon page view/load
const results = await search(q)

// now that we have the search results, let's update/set the state of the table
table.value.results = results
table.value.hits = results?.hits
table.value.source = source
table.value.type = type
table.value.columns = cols
table.value.searchable = searchable
table.value.query = query
table.value.filters = facetFilters
table.value.filterable = filterable
table.value.sort = sort
table.value.sorts = sortDirections
table.value.sortable = sortable
table.value.perPage = itemsPerPage
table.value.actions = actions
table.value.actionable = actionable

// this unfortunately triggers an initial "double search" scenario. Unsure if it persists beyond the initial "session"
watchEffect(async () => {
  const results = await search(q)

  table.value.results = results
  table.value.hits = results?.hits
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col mt-8">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 inline-block align-middle md:px-6 lg:px-8">
          <div class="shadow ring-black ring-1 ring-opacity-5 overflow-hidden md:rounded-lg">
            <table class="divide-y min-w-full divide-gray-300">
              <TableHead />
              <TableBody />
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@unocss/reset/tailwind.css';
</style>
