# @stacksjs/table

Typed searching, filtering, sorting, faceting, ranking, and pagination for data tables. The core has no runtime dependencies and works with an in-memory dataset, Meilisearch, Algolia, or Typesense.

## Install

```bash
bun add @stacksjs/table
```

## In-memory development

The memory driver provides realistic table behavior without a search service, credentials, Docker, or network access.

```ts
import { createTable, MemoryTableDriver } from '@stacksjs/table'

const driver = new MemoryTableDriver({
  products: [
    { id: 1, name: 'Mechanical Keyboard', category: 'hardware', price: 149 },
    { id: 2, name: 'TypeScript Handbook', category: 'books', price: 39 },
    { id: 3, name: 'Wireless Keyboard', category: 'hardware', price: 89 },
  ],
})

const products = createTable({
  driver,
  index: 'products',
  searchFields: ['name'],
  ranking: { rules: ['price:asc'] },
})

const result = await products.search({
  query: 'keyboard',
  filters: { category: 'hardware' },
  facets: ['category'],
})
```

Run the included dummy database example with `bun run demo:memory`. It is also declared in `terminals.json` for development environments that expose project terminals.

## Meilisearch

```ts
import { createTable, MeilisearchTableDriver } from '@stacksjs/table'

const products = createTable({
  driver: new MeilisearchTableDriver({
    host: 'https://search.example.com',
    apiKey: process.env.MEILISEARCH_API_KEY,
  }),
  index: 'products',
  ranking: { rules: ['words', 'typo', 'proximity', 'sort', 'exactness'] },
})
```

## Algolia

```ts
import { AlgoliaTableDriver, createTable } from '@stacksjs/table'

const products = createTable({
  driver: new AlgoliaTableDriver({
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
  }),
  index: 'products',
  ranking: { rules: ['desc(popularity)', 'asc(price)'] },
})
```

Algolia searches use its distributed search host. Ranking updates use the write host and finish before the first table search. Use a search-only key when no ranking is configured, and a key with settings permission when it is.

## Typesense

```ts
import { createTable, TypesenseTableDriver } from '@stacksjs/table'

const products = createTable({
  driver: new TypesenseTableDriver({
    host: 'https://typesense.example.com',
    apiKey: process.env.TYPESENSE_API_KEY,
    queryBy: ['name', 'description'],
  }),
  index: 'products',
})

const result = await products.search({
  query: 'keyboard',
  filters: { category: ['hardware', 'accessories'] },
  sort: ['price:asc'],
})
```

Typesense ranking is expressed per query through `sort`, which matches its API model. Remote index-ranking configuration is only exposed by drivers whose engines support that operation.

## Driver contract

Custom drivers implement two methods:

```ts
interface TableDriver<Row> {
  readonly name: string
  search(request: TableSearchRequest): Promise<TableSearchResult<Row>>
  setRanking?(index: string, ranking: TableRanking): Promise<void>
}
```

Every driver returns the same result shape, so view code does not depend on a vendor SDK response.

## Development

```bash
bun install
bun test
bun run test:types
bun run lint
bun run build
```

## License

MIT
