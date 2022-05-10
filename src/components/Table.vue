<script setup lang="ts">
import { isString } from '@vueuse/core'
import TableBody from './TableBody.vue'
import TableHead from './TableHead.vue'
import { useTable } from '~/composables/table'

interface Props {
  source?: string
  type: string
  columns: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string
  sorts?: string | string[]
  filterable?: string | boolean
  filters?: string | string[]
  actionable?: string | boolean
  actions?: string | string[]
  perPage?: string | number
  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean
}

const props = defineProps<Props>()

// let's destructure the props and set some defaults for our reactive values
let { columns, perPage = 20, sorts = [] } = props

const {
  source = 'http://127.0.0.1:7700',
  type,
  searchable = true,
  query,
  filters = [],
  filterable = true,
  sortable = true,
  actions = [],
  actionable = false,
} = props

function initializeTable() {
  // eslint-disable-next-line no-console
  console.log('initializing table')

  if (isString(columns))
    columns = columns.split(',').map(col => col.trim())

  if (isString(sorts))
    sorts = sorts.split(',').map(col => col.trim())

  if (isString(perPage))
    perPage = parseInt(perPage)

  const initialData = {
    source,
    type,
    columns,
    searchable,
    query,
    filters,
    filterable,
    sorts,
    sortable,
    actions,
    actionable,
    perPage,
    currentPage: 1,
  }

  // eslint-disable-next-line no-console
  console.log('initial data', initialData)

  // let's initialize the table now
  const table = useTable(initialData)
  // eslint-disable-next-line no-console
  console.log('test', table.store)
  const results = table?.store?.value?.results
  // eslint-disable-next-line no-console
  console.log('results', results)
}

initializeTable()
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
