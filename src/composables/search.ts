import { isString } from '@vueuse/core'
import { MeiliSearch } from 'meilisearch'
import type { SearchParams as MeiliSearchSearchParams } from 'meilisearch'
import { deepUnref } from '@ow3/deep-unref-vue'
import { useTable } from './table'

const { table, searchParams } = $(useTable())
// eslint-disable-next-line no-console
console.log('tabless', table)

// TODO: also separately push this as a composable to npm
export function useSearch() {
  function client(apiKey = '') {
    // eslint-disable-next-line no-console
    console.log('table.source', table.source)
    return new MeiliSearch({
      host: table.source,
      apiKey,
    })
  }

  async function search(q?: string, params?: MeiliSearchSearchParams) {
    // eslint-disable-next-line no-console
    console.log('search is called with', q, params)

    if (table === undefined)
      return

    const query = isString(q) ? q : table?.query

    if (!client)
      return

    const index = client.index(table.type)
    const results = await index.search(query, deepUnref(searchParams))

    // eslint-disable-next-line no-console
    console.log('results', results)

    return results
  }

  return $$({
    client,
    search,
  })
}
