import type { SearchParams, SearchResponse } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'

export async function getSearchClient(apiKey = '') {
  return new MeiliSearch({
    host: tableStore.value.source,
    apiKey,
  })
}

export async function search() {
  const query = tableStore.value.query?.trim() || ''
  const perPage = tableStore.value.perPage
  const currentPage = tableStore.value.currentPage
  const type = tableStore.value.type // index name
  const options: SearchParams = {
    offset: (currentPage - 1) * perPage,
    limit: perPage,
  }

  const index = (await getSearchClient()).index(type)
  const results = await index.search(query, options)

  tableStore.value.results = results

  // eslint-disable-next-line no-console
  console.log('index is', tableStore.value.type)
  // eslint-disable-next-line no-console
  console.log('query', query)
  // eslint-disable-next-line no-console
  console.log('results', results)

  return results
}
