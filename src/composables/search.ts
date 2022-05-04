import type { Index, SearchResponse } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'
import { tableStore } from './table'

export async function search(index: Index, search: string, attrs: object) {
  const q = search.trim()
  const perPage = tableStore.value.perPage as number || 20
  const options = { limit: perPage }
  const config = attrs
  const results: SearchResponse<Record<string, any>> = await index.search(q, options, config)

  return results
}

export function getSearchClient(source: string, apiKey: string) {
  return new MeiliSearch({
    host: source,
    apiKey,
  })
}
