<script setup lang="ts">
// import { MeiliSearch } from 'meilisearch'
import { isString } from '@vueuse/core'
import { tableStore } from '~/composables/table'

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

if (isString(columns))
  columns = columns.split(',')

// TODO: props overrules table-configure shared tableStore

onMounted(async () => {
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

  const client = getSearchClient(tableStore.value.source)
  const clientIndex = client.index(index as string)
  const settings = await clientIndex.getSettings()
  tableStore.value.results = await search(clientIndex)

  // eslint-disable-next-line no-console
  console.log('tableStore is', tableStore)
  // eslint-disable-next-line no-console
  console.log('settings', settings)
})
</script>

<!-- Workaround for: "Component is missing template or render function" -->
<template>
  <span class="hidden" />
</template>
