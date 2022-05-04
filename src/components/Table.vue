<script setup lang="ts">
import { isBoolean, isString } from '@vueuse/core'
import type { TableStore } from '~/composables/table'
import { tableStore } from '~/composables/table'

// 1. we need to initialize the props
// 2. all them are have to accept strings because our Web Component library can only accept strings
// 3. store the props to localStorage using useStorage and ensure reactivity
// 4. we need to ini

interface Props {
  source: string
  type: string
  title: string
  subTitle: string
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
let { columns } = props
const {
  source,
  type,
  title,
  subTitle,
  searchable = true,
  query,
  filters = [],
  filterable = false,
  sorts = [],
  sortable = false,
  actions = [],
  actionable = false,
  perPage = 20,
} = props

await setInitialState()

search()

// TODO: props overrules table-configure shared tableStore

// eslint-disable-next-line no-console
console.log('tableStore', tableStore)

let currentPageIndex = $ref(1)
const sortOrders = $ref([])
// let sortString = $ref([])

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('source is', source)
  // eslint-disable-next-line no-console
  console.log('type is', type)
  // eslint-disable-next-line no-console
  console.log('title is', title)
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

function isColumnSortable(col: string): Boolean {
  if (isString(sortable))
    return sortable.includes(col)
  else if (isBoolean(sortable))
    return sortable
  else
    return false
}

function isColumnUsedAsSort(col: string) {
  return sortOrders[col]
}

function prevPage() {
  currentPageIndex = currentPageIndex - 1

  if (currentPageIndex < 1)
    currentPageIndex = 1

  // clientSearch(sortString, '', currentPageIndex)
}

function nextPage() {
  currentPageIndex = currentPageIndex + 1

  if (currentPageIndex <= 1)
    currentPageIndex = 1

  // clientSearch(sortString, '', currentPageIndex)
}

async function setInitialState() {
  if (isString(columns))
    columns = columns.split(',')

  const initialData: TableStore = {
    source,
    type,
    title,
    subTitle,
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
  }

  // then, let's set the initial state
  tableStore.value = initialData
}
</script>

<template>
  <div class="font-sans px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="font-semibold text-xl text-gray-900">
          {{ title }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ subTitle }}
        </p>
      </div>
      <div class="mt-4 sm:flex-none sm:mt-0 sm:ml-16">
        <button
          type="button"
          class="border border-transparent rounded-md font-medium bg-indigo-600 shadow-sm text-sm text-white py-2 px-4 inline-flex items-center justify-center sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add user
        </button>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 inline-block align-middle md:px-6 lg:px-8">
          <div class="shadow ring-black ring-1 ring-opacity-5 overflow-hidden md:rounded-lg">
            <table class="divide-y min-w-full divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(columnName, index) in columns" :key="index" scope="col"
                    :class="index === 0 ? `font-semibold text-left text-sm py-3.5 pr-3 pl-4 text-gray-900 sm:pl-6` : `font-semibold text-left text-sm py-3.5 px-3 text-gray-900`"
                  >
                    <a href="#" class="group inline-flex">
                      {{ columnName }}
                      <span
                        v-if="isColumnSortable(columnName)" class="rounded flex-none ml-2 "
                        :class="isColumnUsedAsSort(columnName) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
                        @click="toggleSort(columnName)"
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
                <tr>
                  <td class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6">
                    Lindsay Walton
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    Front-end Developer
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    lindsay.walton@example.com
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    Member
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    Member
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    Member
                  </td>
                  <td class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap">
                    Member
                  </td>
                  <td class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay
                      Walton</span></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TablePagination
    v-if="true"
    :current-page="currentPageIndex"
    :results="tableStore.results"
    @previous-page="prevPage"
    @next-page="nextPage"
  />
</template>

<style scoped>
@import '@unocss/reset/tailwind.css';
</style>
