<script setup lang="ts">
// import { MeiliSearch } from 'meilisearch'
import { state } from '~/composables/storage'
// import { getSearchClient, search } from '~/composables/search'

interface Props {
  source?: string
  type?: string | boolean // // TODO: in order to be fully optional, we need to implement a "indices component" which is triggered prior to rendering a specific index's data
  useTitle?: string | boolean // defaults to false but may also accept a string to use as the title. Title defaults to the capitalized index name
  useSubTitle?: string | boolean // defaults to false but may also accept a string to use as the subtitle.
  title?: string | boolean
  subTitle?: string | boolean
  columns: string // is used as the "table heads"/titles based on the same order the comma-separated string was provided in
  searchable?: string | boolean // -> TODO: determines whether the search input is displayed. If string is provided, use as placeholder. Add useSearch alias?. Defaults to `true`
  query?: string
  sortable?: string | boolean
  filterable?: string | boolean // -> TODO: determines whether the filters are displayed, , e.g. "traits_Head, traits_Body, traits_Background". `auto` could become a "setting" option as well. Alias: filters, useFilters- auto could become a setting as well. Defaults to `true`
  actionable?: string | boolean // -> TODO: determines whether the "edit"/action button is displayed. Future version should allow for more configuration here
  perPage?: string | number

  // aliases
  src?: string // alias of `source`
  host?: string // alias of `source` (for backwards compatibility)
  index?: string // alias of `index` (for backwards compatibility)
  cols?: string // alias of `columns`
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
  columns = null,
  searchable = true,
  query = null,
  sortable = true,
  filterable = true,
  actionable = false,
  perPage = 20,
} = props

// aliases are constants
const {
  src = null,
  index = null,
  host = null,
  cols = null,
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
} = props

// first, let's ensure the reactive state we are preparing is considering alias usages

determineAliasUsage()

// TODO: props overrules table-configure shared state

state.value.perPage = perPage

// let page = $ref(1)
const sortOrders = $ref([])
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

async function toggleSort(col: string, order: string) {
  switch (order) {
    case 'asc':
      sortOrders[col] = 'desc'
      break
    case 'desc':
      sortOrders[col] = ''
      break
    case '':
      sortOrders[col] = 'asc'
      break
    default:
      sortOrders[col] = 'asc'
  }

  if (sortOrders[col] !== '')
    sortString = [`${col}:${sortOrders[col]}`]
  else
    sortString = []

  await clientSearch(sortString, '', page)
}

function isColSortable(col: string): Boolean {
  return sortable.includes(col)
}

// async function clientSearch(sort: Array<String>, query: string, page = 1) {
//   const client = getSearchClient(state.value.host, '')
//   const clientIndex = client.index(index)
//   state.value.results = await search(clientIndex, query, { sort, offset: page })
// }

async function toggleSearch(event: object): void {
  // clientSearch(sortString, event.target.value)
}

function prevPage() {
  // page = page - 1
  // if (page < 1)
  //   page = 1

  // clientSearch(sortString, '', page)
}

function nextPage() {
  // page = page + 1

  // if (page <= 1)
  //   page = 1

  // clientSearch(sortString, '', page)
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
  <div class="font-sans px-4 table-v2 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="font-semibold text-xl text-gray-900">
          {{ title }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ subTitle }}
        </p>
      </div>
      <div v-if="searchable">
        <input
          id="search" ref="searchInput" type="text" name="search"
          class="border-none rounded-md cursor-pointer h-12 w-full pr-12 pl-4 transition ease-in-out duration-150 block placeholder:text-gray-3 sm:text-sm focus:ring-2 focus:ring-pink-500"
          :placeholder="`Search ${state.index}`" @input="toggleSearch($event)"
        >
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
                    v-for="(col, colIndex) in cols" :key="colIndex" scope="col"
                    class="font-semibold text-left text-sm py-3.5 px-3 text-gray-900"
                  >
                    <div class="flex items-center">
                      {{ col }}
                      <a
                        v-if="isColSortable(col)" href="#" class="inline-flex group"
                        @click="toggleSort(col, sortOrders[col])"
                      >
                        <span
                          v-if="['desc', undefined, ''].includes(sortOrders[col])"
                          :class="sort === 'name' ? `invisible text-gray-400 group-hover:visible group-focus:visible` : `bg-gray-200 text-gray-900 group-hover:bg-gray-300`"
                          class="rounded flex-none ml-2"
                        >
                          <!-- Heroicon name: solid/chevron-down -->
                          <svg
                            class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                        <span
                          v-if="sortOrders[col] === 'asc'"
                          :class="sort === 'name' ? `invisible text-gray-400 group-hover:visible group-focus:visible` : `bg-gray-200 text-gray-900 group-hover:bg-gray-300`"
                          class="rounded flex-none ml-2"
                        >
                          <!-- Heroicon name: solid/chevron-up -->
                          <svg
                            class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </th>
                  <th v-if="actionable" scope="col" class="py-3.5 pr-4 pl-3 relative sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white divide-gray-200">
                <tr v-for="(item, itemIndex) in state.results.hits" :key="itemIndex">
                  <td
                    v-for="(col, colIndex) in cols" :key="colIndex"
                    class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
                  >
                    {{ item[col] }}
                  </td>

                  <td
                    v-if="actionable"
                    class="font-medium text-sm text-right py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
                  >
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay
                      Walton</span></a>
                  </td>
                </tr>

                <!-- More people... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <TablePagination
      v-if="true" :current-page="page" :results="state.results" @previous-page="prevPage"
      @next-page="nextPage"
    />
  </div>
</template>

<style scoped>
</style>
