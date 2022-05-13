import { isString } from '@vueuse/core'
import { MeiliSearch } from 'meilisearch'
import type { SearchParams as MeiliSearchSearchParams } from 'meilisearch'
import { useTable } from './table'

// TODO: also separately push this as a composable to npm
export function useSearch() {
  function getClient(apiKey = '') {
    const { table } = $(useTable())

    if (!table?.source)
      return

    // eslint-disable-next-line no-console
    console.log('host', table)

    return new MeiliSearch({
      host: table.source,
      apiKey,
    })
  }

  async function search(q?: string, params?: MeiliSearchSearchParams) {
    // eslint-disable-next-line no-console
    console.log('search is called with', q, params)

    const { table, searchParams } = $(useTable())

    // eslint-disable-next-line no-console
    console.log('table', table)

    const query = isString(q) ? q : table?.query

    if (table === undefined)
      return

    const client = (await getClient())

    // eslint-disable-next-line no-console
    console.log('client', client)

    if (!client)
      return

    const index = client.index(table.type)
    const results = await index.search(query, searchParams)

    return results
  }

  return $$({
    getClient,
    search,
  })
}
