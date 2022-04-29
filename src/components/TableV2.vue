<script setup lang="ts">
// import { MeiliSearch } from 'meilisearch'
import { state } from '~/composables/storage'
import { getSearchClient, search } from '~/composables/search'

const props = defineProps<{
  source?: string // TODO: should make sure at least one of these three is required to be set
  host?: string // alias of `source`
  src?: string // alias of `source`
  index?: string // TODO: in order to be fully optional, we need to implement a "indices component" which is triggered prior to rendering a specific index's data
  columns: string // is used as the "table heads"/titles based on the same order the `string` was provided in
  searchable?: string | boolean // -> TODO: determines whether the search input is displayed. If string is provided, use as placeholder. Add useSearch alias?. Defaults to `true`
  sortable?: string
  // filterable?: string -> TODO: determines whether the filters are displayed, , e.g. "traits_Head, traits_Body, traits_Background". `auto` could become a "setting" option as well. Alias: filters, useFilters- auto could become a setting as well. Defaults to `true`
  actionable?: string | boolean // -> TODO: determines whether the "edit"/action button is displayed. Future version should allow for more configuration here
  title?: string // -> TODO: defaults to capitalized $indexName. Alias: useTitle, defaults to `true`
  subTitle?: string // -> TODO: defaults to "A list of all the $pluralVersionOfIndexName in your database including their $columns[0], $columns[1], $columns[2] and $columns[3]." - based on amount of cols
  // perPage?: number -> TODO: determines the items displayed per page. Defaults to 20.
  usePagination?: boolean // -> TODO: determines whether to display/use the pagination feature. Defaults to `true`
}>()

// TODO: props overrules table-configure shared state

const sort = $ref('')

const columns = $computed(() => props.columns.split(', '))
const sortable = $computed(() => props.sortable.split(', '))

const hits = state.value.results.hits
const index = state.value.index

// async function sortTable(sort: string) {

// }

let finalOrder = $ref('')
async function toggleSort(col: string, order: string) {
  let sortString = ''
  switch (order) {
    case 'asc':
      finalOrder = 'desc'
      break
    case 'desc':
      finalOrder = ''
      break
    case '':
      finalOrder = 'asc'
      break
    default:
      finalOrder = 'asc'
  }

  if (finalOrder !== '')
    sortString = [`${col}:${finalOrder}`]
  else
    sortString = []

  const client = getSearchClient(state.value.host, '')
  const clientIndex = client.index(index)
  state.value.results = await search(clientIndex, '', { sort: sortString })
}

function isColSortable(col: string): Boolean {
  return sortable.includes(col)
}
</script>

<template>
  <div class="px-4 font-sans table-v2 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ title }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ subTitle }}
        </p>
      </div>
      <div v-if="searchable">
        <input
          id="search"
          ref="searchInput"
          type="text"
          name="search"
          class="block w-full h-12 pl-4 pr-12 transition duration-150 ease-in-out border-none rounded-md cursor-pointer placeholder:text-gray-3 focus:ring-2 focus:ring-pink-500 sm:text-sm"
          placeholder="Search Collections..."
        >
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button type="button" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
          Add user
        </button>
      </div>
    </div>
    <div class="flex flex-col mt-8">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="(col, colIndex) in columns" :key="colIndex" scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" @click="toggleSort(col, finalOrder)">
                    <div class="flex items-center">
                      {{ col }}
                      <a v-if="isColSortable(col)" href="#" class="inline-flex group" @click="toggleSort(col, finalOrder)">
                        <span v-if="(finalOrder === 'desc' || finalOrder === '')" :class="sort === 'name' ? `invisible text-gray-400 group-hover:visible group-focus:visible` : `bg-gray-200 text-gray-900 group-hover:bg-gray-300`" class="flex-none ml-2 rounded">
                          <!-- Heroicon name: solid/chevron-down -->
                          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </span>
                        <span v-if="finalOrder === 'asc'" :class="sort === 'name' ? `invisible text-gray-400 group-hover:visible group-focus:visible` : `bg-gray-200 text-gray-900 group-hover:bg-gray-300`" class="flex-none ml-2 rounded">
                          <!-- Heroicon name: solid/chevron-up -->
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
                        </span>
                      </a>
                    </div>
                  </th>
                  <th v-if="actionable" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, itemIndex) in hits" :key="itemIndex">
                  <td v-for="(col, colIndex) in columns" :key="colIndex" class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                    {{ item[col] }}
                  </td>

                  <td v-if="actionable" class="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                  </td>
                </tr>

              <!-- More people... -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Pagination v-if="usePagination" />
  </div>
</template>

<style>
@import "../styles/index.css";
</style>
