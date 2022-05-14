import { isString } from '@vueuse/core'
import { MeiliSearch } from 'meilisearch'
import { useTable } from './table'

const { table } = $(useTable())

function client(apiKey = ''): MeiliSearch {
  // eslint-disable-next-line no-console
  console.log('table.source', table.source)
  return new MeiliSearch({
    host: table.source,
    apiKey,
  })
}

// TODO: also separately push this as a composable to npm
export function useSearch() {
  async function search(q?: string) {
    try {
      if (table === undefined)
        return

      const query = isString(q) ? q : (table?.query ? table.query : '')
      const index = client().index(table.type)
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
