import { isRecord } from '../utils/isRecord'

export type StatsReport = {
  id: 'main' | 'history'
  title: string
  path: string
  page_count: number
  size_bytes: number
  sha256: string
}

export type StatsCatalog = {
  schema_version: 1
  edition: string
  reports: StatsReport[]
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function isEditionDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const timestamp = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value
}

function parseReport(value: unknown, edition: string): StatsReport {
  if (!isRecord(value)
    || (value.id !== 'main' && value.id !== 'history')
    || typeof value.title !== 'string' || !value.title.trim()
    || typeof value.path !== 'string'
    || typeof value.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(value.sha256)
    || !isPositiveInteger(value.page_count) || !isPositiveInteger(value.size_bytes)) {
    throw new Error('Bokkatalogen inneholder en ugyldig bok.')
  }
  const basename = value.id === 'main' ? 'kk67-main-lifters' : 'kk67-almanac'
  if (value.path !== `${edition}/${basename}-${value.sha256}.pdf`) {
    throw new Error('Bokkatalogen inneholder en ugyldig PDF-adresse.')
  }
  return {
    id: value.id,
    title: value.title,
    path: value.path,
    page_count: value.page_count,
    size_bytes: value.size_bytes,
    sha256: value.sha256,
  }
}

export function parseStatsCatalog(value: unknown): StatsCatalog {
  if (!isRecord(value) || value.schema_version !== 1 || !isEditionDate(value.edition)
    || !Array.isArray(value.reports) || value.reports.length === 0) {
    throw new Error('Bokkatalogen har et ugyldig eller ukjent format.')
  }
  const edition = value.edition
  const reports = value.reports.map(report => parseReport(report, edition))
  if (new Set(reports.map(report => report.id)).size !== reports.length) {
    throw new Error('Bokkatalogen inneholder samme bok flere ganger.')
  }
  return { schema_version: 1, edition, reports }
}

export function statsPdfUrl(report: StatsReport): string {
  return `/public/stats/${report.path}`
}

export async function loadStatsCatalog(): Promise<StatsCatalog> {
  const response = await fetch('/public/stats/index.json', { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`Bokkatalogen kunne ikke lastes (HTTP ${response.status}).`)
  }
  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new Error('Bokkatalogen mangler eller har feil innholdstype.')
  }
  const value: unknown = await response.json()
  return parseStatsCatalog(value)
}
