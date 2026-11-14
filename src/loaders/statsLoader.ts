import { isRecord } from '../utils/isRecord'

export type StatsReport = {
  id: 'main' | 'history'
  title: string
  path: string
  page_count: number
  size_bytes: number
  sha256: string
}

export type StatsEdition = {
  edition_year: number
  edition: string
  reports: StatsReport[]
  highlights: string[]
}

export type StatsCatalog = StatsEdition & {
  schema_version: 1
  archive: StatsEdition[]
  next_edition_year: number | null
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function isEditionYear(value: unknown): value is number {
  return isPositiveInteger(value) && value <= 9999
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isEditionDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)
    || !isEditionYear(Number(value.slice(0, 4)))) return false
  const timestamp = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value
}

function parseReport(value: unknown, edition: string): StatsReport {
  if (!isRecord(value)
    || (value.id !== 'main' && value.id !== 'history')
    || !isNonEmptyString(value.title)
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

function parseEdition(value: unknown): StatsEdition {
  if (!isRecord(value) || !isEditionDate(value.edition)
    || !Array.isArray(value.reports) || value.reports.length === 0) {
    throw new Error('Bokkatalogen inneholder en ugyldig årsutgave.')
  }
  const edition = value.edition
  const editionYear = value.edition_year == null ? Number(edition.slice(0, 4)) : value.edition_year
  const highlights = value.highlights === undefined ? [] : value.highlights
  if (!isEditionYear(editionYear)
    || !Array.isArray(highlights) || !highlights.every(isNonEmptyString)) {
    throw new Error('Bokkatalogen inneholder et ugyldig utgaveår eller oppdateringsnotat.')
  }
  const reports = value.reports.map(report => parseReport(report, edition))
  if (new Set(reports.map(report => report.id)).size !== reports.length) {
    throw new Error('Bokkatalogen inneholder samme bok flere ganger.')
  }
  return { edition_year: editionYear, edition, reports, highlights }
}

export function parseStatsCatalog(value: unknown): StatsCatalog {
  if (!isRecord(value) || value.schema_version !== 1) {
    throw new Error('Bokkatalogen har et ugyldig eller ukjent format.')
  }
  const current = parseEdition(value)
  const archived = value.archive === undefined ? [] : value.archive
  if (!Array.isArray(archived)) {
    throw new Error('Bokkatalogen inneholder et ugyldig utgavearkiv.')
  }
  const archive = archived.map(parseEdition)
  const years = archive.map(edition => edition.edition_year)
  if (new Set(years).size !== years.length || years.some(year => year >= current.edition_year)) {
    throw new Error('Utgavearkivet må inneholde ulike år før den nyeste årsutgaven.')
  }
  const nextEditionYear = value.next_edition_year == null ? null : value.next_edition_year
  if (nextEditionYear !== null
    && (!isEditionYear(nextEditionYear) || nextEditionYear <= current.edition_year)) {
    throw new Error('Planen for neste årsutgave er ugyldig.')
  }
  return { schema_version: 1, ...current, archive, next_edition_year: nextEditionYear }
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
