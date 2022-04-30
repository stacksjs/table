// the useStorage API is auto-imported from @vueuse/core
import { useStorage } from '@vueuse/core'
// TODO: this needs to become the data structure we accept for the search request
const data: Object = {
  sorts: [],
  filters: [],
  query: null,
  perPage: 20,
  results: [],
  host: '',
  index: '',
  columns: '',
  client: {},
  settings: {},
}

export const state: Ref<Object> = useStorage('table-store', data)
