<script setup lang="ts">
import { isString } from '@vueuse/core'
import TableBody from './TableBody.vue'
import TableHead from './TableHead.vue'
import { useTable } from '~/composables/table'
import { useSearch } from '~/composables/search'

interface Props {
  source?: string
  type: string
  columns: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string | boolean
  sort?: string
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

const cols = $computed(() => {
  if (isString(columns))
    return columns.split(',').map(col => col.trim())

  return columns
})

const columnsExcludingLast = $computed(() => cols?.slice(0, -1))

const sortDirections = $computed(() => {
  if (isString(sorts))
    return sorts.split(',').map(col => col.trim())

  return sorts
})

const facetFilters = $computed(() => {
  if (isString(filters))
    return filters.split(',').map(col => col.trim())

  return filters
})

const itemsPerPage = $computed(() => {
  if (isString(perPage))
    return parseInt(perPage)

  return perPage
})

// eslint-disable-next-line no-console
console.log('initializing table')

// onBeforeMount(() => {
// let's initialize/use the table by passing the default state
const { searchParams, query: q } = useTable({
  source,
  type,
  columns: cols,
  columnsExcludingLast,
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

// let's run the initial search to populate the table
const { search } = $(useSearch())

// eslint-disable-next-line no-console
console.log('beforeSearch values should be filled', unref(q), unref(searchParams))

search(unref(q), unref(searchParams))

watchEffect(async () => {
  // eslint-disable-next-line no-console
  console.log('watcheffect values should be filled', q, searchParams)
  search(unref(q), unref(searchParams)) // are searchParams updates picked up by the watcher? Need to investigate
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col mt-8">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 inline-block align-middle md:px-6 lg:px-8">
          <div class="shadow ring-black ring-1 ring-opacity-5 overflow-hidden md:rounded-lg">
            <table class="divide-y min-w-full divide-gray-300">
              <TableHead :columns="cols" :sorts="sortDirections" />
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
