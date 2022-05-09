import type { SearchParams } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'

export function useSearch() {
  function getSearchClient(apiKey = '') {
    const { store } = $(useTable())

    if (!store)
      return

    // eslint-disable-next-line no-console
    console.log('storeD', store.source)

    return new MeiliSearch({
      host: store.source,
      apiKey,
    })
  }

  async function search() {
    const { store } = $(useTable())

    if (!store)
      return

    const query = store.query?.trim() || ''
    const perPage = store.perPage
    const currentPage = store.currentPage
    const type = store.type // index name
    const options: SearchParams = {
      offset: (currentPage - 1) * perPage,
      limit: perPage,
    }

    const client = (await getSearchClient())
    if (!client)
      return

    const index = client.index(type)
    const results = await index.search(query, options)

    store.results = results

    // eslint-disable-next-line no-console
    console.log('index is', store.type)
    // eslint-disable-next-line no-console
    console.log('query', query)
    // eslint-disable-next-line no-console
    console.log('results', results)

    return results
  }

  return {
    getSearchClient,
    search,
  }
}
