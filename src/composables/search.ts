import { isString } from '@vueuse/core'
import { MeiliSearch } from 'meilisearch'
import { useTable } from './table'

const { table } = $(useTable())

function client(apiKey = ''): MeiliSearch {
  return new MeiliSearch({
    host: table.source,
    apiKey,
  })
}

// TODO: also separately push this as a composable to npm
export function useSearch() {
  async function search(q?: string) {
    if (table === undefined)
      return

    const query = isString(q) ? q : table?.query

    if (!client)
      return

    const index = client().index(table.type)

    try {
      const results = await index.search(query)

      // eslint-disable-next-line no-console
      console.log('results', results)

      return results
    }
    catch (error) {
      console.error('error when performing search', error)
    }
  }

  return $$({
    client,
    search,
  })
}
