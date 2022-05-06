<script setup lang="ts">
import { isString } from '@vueuse/core'
import type { TableStore } from '~/composables/table'
import { isColumnSortable, tableStore } from '~/composables/table'

interface Props {
  source: string
  type: string
  columns?: string | string[]
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
let { columns, perPage = 20 } = props

const {
  source,
  type,
  searchable = true,
  query,
  filters = [],
  filterable = false,
  sorts = [],
  sortable = false,
  actions = [],
  actionable = false,
} = props

ensureInitialStateIsSet()

search()

// eslint-disable-next-line no-console
console.log('tableStore', tableStore)

const sortOrders = $ref([])

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('source is', source)
  // eslint-disable-next-line no-console
  console.log('type is', type)
  // eslint-disable-next-line no-console
  console.log('columns is', columns)
  // eslint-disable-next-line no-console
  console.log('query is', query)
  // eslint-disable-next-line no-console
  console.log('filterable is', filterable)
  // eslint-disable-next-line no-console
  console.log('perPage is', perPage)
})

function toggleSort(col: string) {
  sortOrders[col] = !sortOrders[col]
}

function isColumnUsedAsSort(col: string) {
  return sortOrders[col]
}

async function ensureInitialStateIsSet() {
  if (isString(columns))
    columns = columns.split(',').map(col => col.trim())

  if (isString(perPage))
    perPage = parseInt(perPage)

  const initialData: TableStore = {
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

  // then, let's set the initial state
  tableStore.value = initialData
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col mt-8">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 inline-block align-middle md:px-6 lg:px-8">
          <div class="shadow ring-black ring-1 ring-opacity-5 overflow-hidden md:rounded-lg">
            <table class="divide-y min-w-full divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(columnName, index) in columns"
                    :key="index"
                    scope="col"
                    :class="index === 0 ? `font-semibold text-left text-sm py-3.5 pr-3 pl-4 text-gray-900 sm:pl-6` : `font-semibold text-left text-sm py-3.5 px-3 text-gray-900`"
                  >
                    <a href="#" class="group inline-flex">
                      {{ columnName.includes(':') ? columnName.split(':')[1].trim() : columnName }}
                      <span
                        v-if="isColumnSortable(columnName.includes(':') ? columnName.split(':')[0].trim() : columnName)" class="rounded flex-none ml-2 "
                        :class="isColumnUsedAsSort(columnName.includes(':') ? columnName.split(':')[0].trim() : columnName) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
                        @click="toggleSort(columnName.includes(':') ? columnName.split(':')[0].trim() : columnName)"
                      >
                        <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
                      </span>
                    </a>
                  </th>

                  <th v-if="actionable || actions.length" scope="col" class="py-3.5 pr-4 pl-3 relative sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y bg-white divide-gray-200">
                <tr
                  v-for="(hit, i) in tableStore.results?.hits"
                  :key="i"
                  scope="row"
                >
                  <!-- <td
                    v-for="(col, y) in columns[0]"
                    :key="y"
                    class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
                  >
                    {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
                  </td> -->

                  <td
                    v-for="(col, x) in columns"
                    :key="x"
                    class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap"
                  >
                    {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
                  </td>

                  <!-- <td
                    v-for="(col, x) in columns[columns.length - 1]"
                    :key="x"
                    class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
                  >
                    {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
                  </td> -->
                </tr>
              </tbody>
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
