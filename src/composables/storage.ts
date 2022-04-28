// the useStorage API is auto-imported from @vueuse/core

// TODO: this needs to become the data structure we accept for the search request
const data: Object = {
  sorts: [],
  filters: [],
  query: null,
  perPage: 15,
  results: [],
  host: '',
  index: '',
  columns: '',
  client: {},
  settings: {},
}

export const state = useStorage('table-store', data)
