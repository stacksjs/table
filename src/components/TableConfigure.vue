<script setup lang="ts">
import { onMounted } from 'vue'
import { state } from '~/composables/storage'
import { getSearchClient, search } from '~/composables/search'

const props = defineProps<{
  source?: string // TODO: should make sure at least one of these three is required to be set
  host?: string // alias of `source`
  src?: string // alias of `source`
  index?: string // TODO: in order to be fully optional, we need to implement a "indices component" which is triggered prior to rendering a specific index's data
  columns: string // is used as the "table heads"/titles based on the same order the `string` was provided in
  // searchable?: string | boolean -> TODO: determines whether the search input is displayed. If string is provided, use as placeholder. Add useSearch alias?. Defaults to `true`
  // sortable?: string | boolean -> TODO: determines whether the sorts are displayed, e.g. "name, price, created_at". `auto` could become a "setting" option as well. Alias: sorts, useSorts. Defaults to `true`
  // sorts: string
  // filterable?: string -> TODO: determines whether the filters are displayed, , e.g. "traits_Head, traits_Body, traits_Background". `auto` could become a "setting" option as well. Alias: filters, useFilters- auto could become a setting as well. Defaults to `true`
  filters: string
  // actionable?: string | boolean -> TODO: determines whether the "edit"/action button is displayed. Future version should allow for more configuration here
  // title?: string -> TODO: defaults to capitalized $indexName. Alias: useTitle, defaults to `true`
  // subTitle?: string -> TODO: defaults to "A list of all the $pluralVersionOfIndexName in your database including their $columns[0], $columns[1], $columns[2] and $columns[3]." - based on amount of cols
  // perPage?: number -> TODO: determines the items displayed per page. Defaults to 20.
  // usePagination?: boolean -> TODO: determines whether to display/use the pagination feature. Defaults to `true`
  query: string
}>()

// for a demo reference https://vueuse.org/core/usestorage/#demo
// const state = useStorage('table-source', {
//   host: props.source ?? props.host ?? props.src,
//   index: props.index,
//   columns: props.columns,
//   query: props.query,
//   sorts: props.sorts,
//   filters: props.filters,
//   settings: '',
//   results: [],
// })

state.value.host = props.source ?? props.host ?? props.src
state.value.columns = props.columns
state.value.query = props.query
// state.value.sorts = props.sorts
state.value.filters = props.filters
state.value.index = props.index

const settings = $ref({})

onMounted(async () => {
  const client = getSearchClient(state.value.host, '')
  const clientIndex = client.index(props.index)
  await clientIndex.getSettings()
  state.value.results = await search(clientIndex, '', {})
})

// eslint-disable-next-line no-console
console.log('state is', state)
</script>

<!-- Workaround for: "Component is missing template or render function" -->
<template><span class="hidden" /></template>
