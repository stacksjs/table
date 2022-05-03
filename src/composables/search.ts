import { MeiliSearch } from 'meilisearch'
import { tableStore } from './table'

export async function search(index: string, search: string, attrs: object): Promise<[]> {
  const q = search.trim()
  const perPage = parseInt(tableStore.value.perPage) || 20
  const results = await index.search(q, { ...{ limit: perPage }, ...attrs })

  return results
}

export function getSearchClient(source: string, apiKey: string) {
  return new MeiliSearch({
    host: source,
    apiKey,
  })
}
