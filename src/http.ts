import type { TableFetch } from './types'

export class TableDriverError extends Error {
  readonly status: number
  readonly response: unknown

  constructor(message: string, status: number, response: unknown) {
    super(message)
    this.name = 'TableDriverError'
    this.status = status
    this.response = response
  }
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export async function requestJson<Result>(
  fetcher: TableFetch,
  url: string,
  init?: RequestInit,
): Promise<Result> {
  const response = await fetcher(url, init)
  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok)
    throw new TableDriverError(`Table driver request failed with HTTP ${response.status}`, response.status, body)

  return body as Result
}

export function positiveInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value))
    return fallback

  return Math.max(1, Math.floor(value))
}

export function encodeIndex(index: string): string {
  return encodeURIComponent(index)
}
