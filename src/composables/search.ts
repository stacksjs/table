import type { SearchResponse } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'

export async function getSearchClient(apiKey = '') {
  return new MeiliSearch({
    host: tableStore.value.source,
    apiKey,
  })
}

export async function search() {
  const query = tableStore.value.query?.trim() || ''
  const source = tableStore.value.source
  // const perPage = tableStore.value.perPage as number || 20
  const client = await getSearchClient()
  // eslint-disable-next-line no-console
  console.log('index is', tableStore.value.type)
  const index = client.index(tableStore.value.type)
  const results: SearchResponse<Record<string, any>> = await index.search(query)
  tableStore.value.results = results

  // eslint-disable-next-line no-console
  console.log('source', source)
  // eslint-disable-next-line no-console
  console.log('query', query)
  // eslint-disable-next-line no-console
  console.log('results', results)

  return results
}
