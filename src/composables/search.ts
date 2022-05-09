import type { SearchParams } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'

export async function getSearchClient(apiKey = '') {
  const { store } = $(useTable())

  return new MeiliSearch({
    host: store.value.source,
    apiKey,
  })
}

export async function search() {
  const { store } = $(useTable())

  const query = store.value.query?.trim() || ''
  const perPage = store.value.perPage
  const currentPage = store.value.currentPage
  const type = store.value.type // index name
  const options: SearchParams = {
    offset: (currentPage - 1) * perPage,
    limit: perPage,
  }

  const index = (await getSearchClient()).index(type)
  const results = await index.search(query, options)

  store.value.results = results

  // eslint-disable-next-line no-console
  console.log('index is', store.value.type)
  // eslint-disable-next-line no-console
  console.log('query', query)
  // eslint-disable-next-line no-console
  console.log('results', results)

  return results
}
