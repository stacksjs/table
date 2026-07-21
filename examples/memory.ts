import { createTable, MemoryTableDriver } from '../resources/functions/table'

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

console.log(await products.search({ query: 'keyboard', filters: { category: 'hardware' } }))
