<script setup lang="ts">
// import { MeiliSearch } from 'meilisearch'
import { isString } from '@vueuse/core'
import { state } from '~/composables/storage'
// import { getSearchClient, search } from '~/composables/search'

interface Props {
  source?: string
  type?: string | boolean // // TODO: in order to be fully optional, we need to implement a "indices component" which is triggered prior to rendering a specific index's data
  useTitle?: string | boolean // defaults to false but may also accept a string to use as the title. Title defaults to the capitalized index name
  useSubTitle?: string | boolean // defaults to false but may also accept a string to use as the subtitle.
  title?: string | boolean
  subTitle?: string | boolean
  columns?: string | string[] // is used as the "table heads"/titles based on the same order the comma-separated string was provided in
  searchable?: string | boolean // -> TODO: determines whether the search input is displayed. If string is provided, use as placeholder. Add useSearch alias?. Defaults to `true`
  query?: string
  sortable?: string | boolean
  filterable?: string | boolean // -> TODO: determines whether the filters are displayed, , e.g. "traits_Head, traits_Body, traits_Background". `auto` could become a "setting" option as well. Alias: filters, useFilters- auto could become a setting as well. Defaults to `true`
  actionable?: string | boolean // -> TODO: determines whether the "edit"/action button is displayed. Future version should allow for more configuration here
  perPage?: string | number
  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean

  // aliases
  src?: string // alias of `source`
  host?: string // alias of `source` (for backwards compatibility)
  index?: string // alias of `index` (for backwards compatibility)
  cols?: string | [] // alias of `columns`
  sorts?: string | boolean // alias of `sortable`
  useSorts?: string | boolean // alias of `sortable`
  filters?: string | boolean // alias of `filterable`
  useFilters?: string | boolean // alias of `filterable`
  actions?: string | boolean // alias of `actionable`
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
  subTitle = 'A list of all the $pluralVersionOfIndexName in your database including their $cols[0], $cols[1], $cols[2] and $cols[3]',
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

// first, let's ensure the reactive state we are preparing is considering alias usages

determineAliasUsage()

if (isString(columns))
  columns = columns.split(',')

// TODO: props overrules table-configure shared state

state.value.perPage = perPage

// let page = $ref(1)
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

const sortOrders = $ref([])

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

// async function clientSearch(sort: Array<String>, query: string, page = 1) {
//   const client = getSearchClient(state.value.host, '')
//   const clientIndex = client.index(index)
//   state.value.results = await search(clientIndex, query, { sort, offset: page })
// }

// async function toggleSearch(event: object): void {
//   // clientSearch(sortString, event.target.value)
// }

// function prevPage() {
//   // page = page - 1
//   // if (page < 1)
//   //   page = 1

//   // clientSearch(sortString, '', page)
// }

// function nextPage() {
//   // page = page + 1

//   // if (page <= 1)
//   //   page = 1

//   // clientSearch(sortString, '', page)
// }

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
          Users
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the users in your account including their name, title, email and role.
        </p>
      </div>
      <div class="mt-4 sm:flex-none sm:mt-0 sm:ml-16">
        <button type="button" class="border border-transparent rounded-md font-medium bg-indigo-600 shadow-sm text-sm text-white py-2 px-4 inline-flex items-center justify-center sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                    v-for="(columnName, index) in columns" :key="index"
                    scope="col"
                    :class="index === 0 ? `font-semibold text-left text-sm py-3.5 pr-3 pl-4 text-gray-900 sm:pl-6` : `font-semibold text-left text-sm py-3.5 px-3 text-gray-900`"
                  >
                    <a href="#" class="group inline-flex">
                      {{ columnName }}
                      <span
                        v-if="isColumnSortable(columnName)"
                        class="rounded flex-none ml-2 "
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
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <TablePagination
    v-if="true" :current-page="page" :results="state.results" @previous-page="prevPage"
    @next-page="nextPage"
  /> -->
</template>

<style scoped>
@import '@unocss/reset/tailwind.css'
</style>
