import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})
after(() => server.close())
const { parseStatsCatalog, loadStatsCatalog } = await server.ssrLoadModule('/src/loaders/statsLoader.ts')
const { default: Statistics } = await server.ssrLoadModule('/src/views/Statistics/index.vue')

function catalog() {
  return {
    schema_version: 1,
    edition: '2026-11-14',
    edition_year: 2026,
    archive: [],
    highlights: [],
    next_edition_year: null,
    reports: [
      { id: 'main', title: 'Hovedløftere', basename: 'kk67-main-lifters', hash: 'a', pages: 171 },
      { id: 'history', title: 'Almanakk', basename: 'kk67-almanac', hash: 'b', pages: 864 },
    ].map(({ id, title, basename, hash, pages }) => ({
      id,
      title,
      path: `2026-11-14/${basename}-${hash.repeat(64)}.pdf`,
      page_count: pages,
      size_bytes: 1049231,
      sha256: hash.repeat(64),
    })),
  }
}

function renderPage(state = {}) {
  return renderToString(createSSRApp({
    ...Statistics,
    data: () => ({
      catalog: null, loading: false, error: '', selectedId: '', selectedYear: null, ...state,
    }),
  }))
}

test('loads the versioned export catalog without reusing a stale cached response', async (t) => {
  const expected = catalog()
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/public/stats/index.json')
    assert.equal(options.cache, 'no-cache')
    return new Response(JSON.stringify(expected), { headers: { 'Content-Type': 'application/json' } })
  })
  assert.deepEqual(await loadStatsCatalog(), expected)
})

test('rejects unsupported, empty, duplicate or unsafe catalog entries', () => {
  const invalid = [
    { ...catalog(), schema_version: 2 },
    { ...catalog(), edition: '2026-02-30' },
    { ...catalog(), reports: [] },
    { ...catalog(), reports: [catalog().reports[0], catalog().reports[0]] },
    ...[
      { path: '../private.pdf' },
      { path: 'https://other.example/book.pdf' },
      { path: '/public/stats/book.pdf' },
      { sha256: 'c'.repeat(64) },
      { page_count: 0 },
      { size_bytes: -1 },
    ].map(change => ({ ...catalog(), reports: [{ ...catalog().reports[0], ...change }] })),
  ]
  for (const value of invalid) assert.throws(() => parseStatsCatalog(value))
})

test('does not interpret missing media or the SPA HTML fallback as a book catalog', async (t) => {
  for (const response of [
    new Response('missing', { status: 404 }),
    new Response('<html>website</html>', { headers: { 'Content-Type': 'text/html' } }),
  ]) {
    t.mock.method(globalThis, 'fetch', async () => response)
    await assert.rejects(loadStatsCatalog())
    t.mock.restoreAll()
  }
})

test('offers both books and direct open/download links without preloading a PDF', async () => {
  const data = catalog()
  const html = await renderPage({ catalog: data })
  assert.match(html, /Hovedløftere/)
  assert.match(html, /Almanakk/)
  assert.match(html, /171 sider/)
  assert.match(html, /864 sider/)
  assert.match(html, /rapportårets konkurranseaktive/)
  assert.match(html, /ikke en rangering av medlemmenes betydning/)
  for (const report of data.reports) {
    assert.ok(html.includes(`href="/public/stats/${report.path}"`))
    assert.ok(html.includes(`download="kk67-${report.id}-${data.edition}.pdf"`))
  }
  assert.match(html, /target="_blank" rel="noopener noreferrer"/)
  assert.doesNotMatch(html, /<object|<iframe/)
})

test('the selected book embeds the original PDF and keeps a direct fallback link', async () => {
  const data = catalog()
  const html = await renderPage({ catalog: data, selectedId: 'history' })
  assert.ok(html.includes(`data="/public/stats/${data.reports[1].path}#view=FitH"`))
  assert.match(html, /<object[^>]*type="application\/pdf"/)
  assert.match(html, /aria-label="Almanakk"/)
  assert.match(html, /Nettleseren din kan ikke vise PDF/)
  assert.ok(html.includes(`href="/public/stats/${data.reports[1].path}"`))
})

test('loading and publication failures are visible and failures can be retried', async () => {
  const loading = await renderPage({ loading: true })
  assert.match(loading, /role="status"/)
  assert.match(loading, /Laster/)
  const failed = await renderPage({ error: 'Bokkatalogen kunne ikke lastes (HTTP 404).' })
  assert.match(failed, /role="alert"/)
  assert.match(failed, /HTTP 404/)
  assert.match(failed, /Prøv igjen/)
  assert.doesNotMatch(failed, /<object|<iframe/)
})

test('retry replaces a failed catalog load with the newly published books', async (t) => {
  const state = { catalog: null, loading: false, error: '', selectedId: '' }
  t.mock.method(globalThis, 'fetch', async () => new Response('missing', { status: 404 }))
  await Statistics.methods.loadCatalog.call(state)
  assert.match(state.error, /HTTP 404/)
  assert.equal(state.loading, false)
  assert.equal(state.catalog, null)

  t.mock.restoreAll()
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify(catalog()), { headers: { 'Content-Type': 'application/json' } }))
  await Statistics.methods.loadCatalog.call(state)
  assert.equal(state.error, '')
  assert.equal(state.loading, false)
  assert.deepEqual(state.catalog, catalog())
})

function pastEdition() {
  const data = catalog()
  return {
    edition_year: 2025,
    edition: '2026-01-10',
    reports: data.reports.map(report => ({
      ...report,
      path: report.path.replace('2026-11-14/', '2026-01-10/'),
      page_count: 42,
    })),
    highlights: ['Reviewed changes in the 2025 edition.'],
  }
}

test('older version 1 catalogs still load without inventing an announced next edition', () => {
  const legacy = catalog()
  for (const field of ['edition_year', 'archive', 'highlights', 'next_edition_year']) delete legacy[field]
  assert.deepEqual(parseStatsCatalog(legacy), catalog())
})

test('validates the complete annual archive, planned year and reviewed update notes', () => {
  const past = pastEdition()
  const invalid = [
    { ...catalog(), edition_year: '2026' },
    { ...catalog(), edition_year: 2026.5 },
    { ...catalog(), next_edition_year: 2026 },
    { ...catalog(), next_edition_year: 10000 },
    { ...catalog(), highlights: ['   '] },
    { ...catalog(), highlights: [42] },
    { ...catalog(), archive: 'not an archive' },
    { ...catalog(), archive: [past, past] },
    { ...catalog(), archive: [{ ...past, edition_year: 2026 }] },
    {
      ...catalog(),
      archive: [{ ...past, reports: [{ ...past.reports[0], path: '../private.pdf' }] }],
    },
    {
      ...catalog(),
      archive: [{
        ...past,
        edition: '0000-01-01',
        reports: past.reports.map(report => ({
          ...report,
          path: report.path.replace(`${past.edition}/`, '0000-01-01/'),
        })),
      }],
    },
  ]
  for (const value of invalid) assert.throws(() => parseStatsCatalog(value))

  const data = { ...catalog(), archive: [past], next_edition_year: 2027 }
  assert.deepEqual(parseStatsCatalog(data), data)
})

test('announces the planned annual edition without offering an unpublished PDF', async () => {
  const data = { ...catalog(), archive: [pastEdition()], next_edition_year: 2027 }
  const html = await renderPage({ catalog: data })
  assert.match(html, /Årlige utgaver/)
  assert.match(html, /aria-label="Vis årsutgave 2025"/)
  assert.match(html, /aria-label="Vis årsutgave 2026"/)
  assert.match(html, /2027/)
  assert.match(html, /Planlagt/)
  assert.match(html, /Utgivelsesdato ikke fastsatt/)
  assert.doesNotMatch(html, /aria-label="Vis årsutgave 2027"/)
  assert.doesNotMatch(html, /\/public\/stats\/2027/)
  assert.doesNotMatch(html, /<object|<iframe/)
})

test('annual navigation uses the About sidebar layout while books stay in the main panel', async () => {
  const data = { ...catalog(), archive: [pastEdition()], next_edition_year: 2027 }
  const html = await renderPage({ catalog: data })
  const sidebar = html.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/)
  assert.ok(sidebar, 'Use the shared page layout with its complementary sidebar')
  assert.match(sidebar[1], /<nav[^>]*aria-labelledby="edition-title"/)
  assert.match(sidebar[1], /aria-label="Vis årsutgave 2025"/)
  assert.match(sidebar[1], /aria-label="Vis årsutgave 2026"/)
  assert.match(sidebar[1], /2027/)
  assert.match(sidebar[1], /Planlagt/)
  assert.doesNotMatch(sidebar[1], /book-card|Les på siden|Nytt i denne utgaven/)
  assert.ok(html.indexOf('class="book-card"') > html.indexOf('</aside>'))
})

test('selecting an archived year shows its books, updates and original PDF URLs', async () => {
  const past = pastEdition()
  const data = { ...catalog(), archive: [past], next_edition_year: 2027 }
  const html = await renderPage({ catalog: data, selectedYear: 2025, selectedId: 'history' })
  assert.match(html, /Årsutgave 2025/)
  assert.match(html, /42 sider/)
  assert.match(html, /Reviewed changes in the 2025 edition/)
  assert.ok(html.includes(`data="/public/stats/${past.reports[1].path}#view=FitH"`))
  assert.ok(html.includes(`download="kk67-history-${past.edition}.pdf"`))
  assert.ok(!html.includes(`href="/public/stats/${data.reports[1].path}"`))
})

test('changing annual editions closes the previous reader instead of showing a stale book', async () => {
  const data = { ...catalog(), archive: [pastEdition()] }
  const state = { catalog: data, selectedYear: null, selectedId: 'history' }
  Statistics.methods.selectEdition.call(state, 2025)
  assert.equal(state.selectedYear, 2025)
  const html = await renderPage(state)
  assert.match(html, /Årsutgave 2025/)
  assert.doesNotMatch(html, /<object|<iframe/)
})

test('update notes are plain text and an empty list is not presented as proof of no changes', async () => {
  const empty = await renderPage({ catalog: catalog() })
  assert.match(empty, /Ingen oppdateringsnotater er lagt inn/)
  const html = await renderPage({ catalog: { ...catalog(), highlights: ['<b>Reviewed change</b>'] } })
  assert.match(html, /Nytt i denne utgaven/)
  assert.match(html, /&lt;b&gt;Reviewed change&lt;\/b&gt;/)
  assert.doesNotMatch(html, /<b>Reviewed change/)
})
