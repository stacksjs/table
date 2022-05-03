import type { Ref } from 'vue'

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

export const tableStore: Ref<Object> = useStorage('table-store', data)
