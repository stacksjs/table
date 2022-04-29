import { MeiliSearch } from 'meilisearch'
import { state } from '~/composables/storage'

export async function search(index: string, search: string, attrs: object): Promise<[]> {
  const q = search || ''
  const perPage = parseInt(state.value.perPage) || 20

  const results = await index.search(q, { ...{ limit: perPage }, ...attrs })

  return results
}

export function getSearchClient(source: string, apiKey: string) {
  return new MeiliSearch({
    host: source,
    apiKey,
  })
}
