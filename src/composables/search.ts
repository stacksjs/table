import type { SearchParams } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'
import { useTable } from './table'

// TODO: also separately push this as a composable to npm
export function useSearch() {
  function getClient(apiKey = '') {
    const { table } = $(useTable())

    if (!table)
      return

    // eslint-disable-next-line no-console
    console.log('tableD', table.source)

    return new MeiliSearch({
      host: table.source,
      apiKey,
    })
  }

  async function search() {
    const { currentPage, perPage, query, type } = $(useTable())
    const options: SearchParams = {
      offset: (currentPage - 1) * perPage,
      limit: perPage,
    }

    const client = (await getClient())

    if (!client)
      return

    const index = client.index(type)
    const results = await index.search(query, options)

    // results = results

    // eslint-disable-next-line no-console
    console.log('index is', type)
    // eslint-disable-next-line no-console
    console.log('query', query)
    // eslint-disable-next-line no-console
    console.log('results', results)

    return results
  }

  return $$({
    getClient,
    search,
  })
}
