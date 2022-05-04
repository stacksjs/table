import type { Index, SearchResponse } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'
// import { tableStore } from './table'

export async function search(index: Index, search = '', attrs: object = {}) {
  const q = search.trim()
  // const perPage = tableStore.value.perPage as number || 20
  // const options = { limit: perPage }
  const config = attrs
  // eslint-disable-next-line no-console
  console.log('config', config)
  const results: SearchResponse<Record<string, any>> = await index.search(q)

  // eslint-disable-next-line no-console
  console.log('results', results)

  return results
}

export function getSearchClient(source: string, apiKey = '') {
  return new MeiliSearch({
    host: source,
    apiKey,
  })
}
