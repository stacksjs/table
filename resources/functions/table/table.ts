import type { Table, TableOptions, TableRow, TableSearchRequest } from './types'

export function createTable<Row extends TableRow = TableRow>(options: TableOptions<Row>): Table<Row> {
  const { driver, index, ranking, ...defaults } = options
  const rankingReady = ranking && driver.setRanking
    ? driver.setRanking(index, ranking)
    : Promise.resolve()

  return {
    driver,
    index,
    rankingReady,
    async search(request = {}) {
      await rankingReady

      const resolved: TableSearchRequest = {
        ...defaults,
        ...request,
        index,
      }

      return driver.search(resolved)
    },
  }
}
