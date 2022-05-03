<script setup lang="ts">
import { isBoolean, isString } from '@vueuse/core'
import { tableStore } from '~/composables/table'

// import { getSearchClient, search } from '~/composables/search'

interface Props {
  source?: string
  type?: string | boolean
  useTitle?: string | boolean
  useSubTitle?: string | boolean
  title?: string | boolean
  subTitle?: string | boolean
  columns?: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string | boolean
  sorts?: string | string[]
  filterable?: string | boolean
  filters?: string | string[]
  actionable?: string | boolean
  actions?: string | string[]
  perPage?: string | number
  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean

  // aliases
  src?: string // alias of `source`
  host?: string // alias of `source` (for backwards compatibility)
  index?: string // alias of `index` (for backwards compatibility)
  cols?: string | [] // alias of `columns`
  useSorts?: string | boolean // alias of `sortable`
  useFilters?: string | boolean // alias of `filterable`
  useActions?: string | boolean // alias of `actionable`
  q?: string // alias of `query`
  search?: string // alias of `searchable`
  useSearch?: string // alias of `searchable`
}

const props = defineProps<Props>()

// let's destructure the props and set some defaults for our reactive values
let {
  source = null,
  type = null,
  title = null,
  subTitle = null,
  columns,
  searchable = true,
  query = null,
  sortable = true,
  filterable = true,
  actionable = false,
} = props

// aliases are constants
const {
  src = null,
  index = null,
  host = null,
  cols,
  sorts = null,
  useSorts = null,
  filters = null,
  useFilters = null,
  actions = null,
  useActions = null,
  q = null,
  search = null,
  useSearch = null,
  useTitle = false,
  useSubTitle = false,
  perPage = 20,
} = props

// first, let's ensure the reactive tableStore we are preparing is considering alias usages

determineAliasUsage()

if (isString(columns))
  columns = columns.split(',')

// TODO: props overrules table-configure shared tableStore

// eslint-disable-next-line no-console
console.log('tableStore', tableStore)

let currentPageIndex = $ref(1)
const sortOrders = $ref([])
// const sortOrders = $ref([])
// let sortString = $ref([])

function determineAliasUsage() {
  if (!source) {
    if (src)
      source = src
    else if (host)
      source = host
  }

  if (!type) {
    if (index)
      type = index
  }

  if (!columns) {
    if (cols)
      columns = cols
  }

  if (!sortable) {
    if (sorts)
      sortable = sorts

    if (useSorts)
      sortable = useSorts
  }

  if (!filterable) {
    if (filters)
      filterable = filters
    if (useFilters)
      filterable = useFilters
  }

  if (!actionable) {
    if (actions)
      actionable = actions
    if (useActions)
      actionable = useActions
  }

  if (!searchable) {
    if (search)
      searchable = search
    if (useSearch)
      searchable = useSearch
  }

  if (!query) {
    if (q)
      query = q
  }

  if (!title) {
    if (useTitle)
      title = useTitle
  }

  if (!subTitle) {
    if (useSubTitle)
      subTitle = useSubTitle
  }
}

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

async function clientSearch(sort: Array<String>, query: string, page = 1) {
  const client = getSearchClient(tableStore.value.host, '')
  const clientIndex = client.index(index)
  tableStore.value.results = await search(clientIndex, query, { sort, offset: page })
}

async function toggleSearch(event: object): void {
  clientSearch(sortString, event.target.value)
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

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('source is', source, src, host)
  // eslint-disable-next-line no-console
  console.log('type is', type, index)
  // eslint-disable-next-line no-console
  console.log('useTitle is', useTitle)
  // eslint-disable-next-line no-console
  console.log('useSubTitle is', useSubTitle)
  // eslint-disable-next-line no-console
  console.log('columns is', columns)
  // eslint-disable-next-line no-console
  console.log('query is', query)
  // eslint-disable-next-line no-console
  console.log('filterable is', filterable)
  // eslint-disable-next-line no-console
  console.log('search is', search)
  // eslint-disable-next-line no-console
  console.log('perPage is', perPage)
})
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

                  <th v-if="actionable" scope="col" class="py-3.5 pr-4 pl-3 relative sm:pr-6">
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
