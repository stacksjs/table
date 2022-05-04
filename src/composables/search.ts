import type { SearchResponse } from 'meilisearch'
import { MeiliSearch } from 'meilisearch'
import { tableStore } from './table'

export async function search(attrs: object = {}) {
  const query = tableStore.value.query?.trim() || ''
  const perPage = tableStore.value.perPage as number || 20
  const source = tableStore.value.source
  const options = { limit: perPage }
  const config = attrs
  // eslint-disable-next-line no-console
  console.log('config', config)
  // eslint-disable-next-line no-console
  console.log('options', options)

  // eslint-disable-next-line no-console
  console.log('source', source)

  const results: SearchResponse<Record<string, any>> = await getSearchClient().index(source).search(query)

  // eslint-disable-next-line no-console
  console.log('results', results)

  return results
}

export function getSearchClient(apiKey = '') {
  return new MeiliSearch({
    host: tableStore.value.source,
    apiKey,
  })
}
