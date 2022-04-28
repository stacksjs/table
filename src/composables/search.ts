import { MeiliSearch } from 'meilisearch'

export async function search(index: string, search: string, attrs: object): Promise<[]> {
  const q = search || ''
  const results = await index.search(q, attrs)

  return results
}

export function getSearchClient(source: string, apiKey: string) {
  return new MeiliSearch({
    host: source,
    apiKey,
  })
}
