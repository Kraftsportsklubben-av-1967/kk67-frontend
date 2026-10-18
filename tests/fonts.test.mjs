import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('Roboto weights load globally rather than depending on a map being opened', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  const head = html.split('</head>')[0]
  const stylesheets = [...head.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter(tag => /\brel="stylesheet"/.test(tag))
    .map(tag => new URL(tag.match(/\bhref="([^"]+)"/)[1].replaceAll('&amp;', '&'), import.meta.url))
  const roboto = stylesheets.find(url => url.hostname === 'fonts.googleapis.com'
    && url.searchParams.getAll('family').some(family => family.startsWith('Roboto')))
  assert.ok(roboto, 'The shared document head must load the site font')
  const family = roboto.searchParams.getAll('family').find(value => value.startsWith('Roboto'))
  assert.match(family, /^Roboto:wght@/, 'Loading only Regular lets Maps change the site typography')
  const ranges = family.split('@')[1].split(';').map(range => {
    const [start, end = start] = range.split('..').map(Number)
    return { start, end }
  })
  for (const weight of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    assert.ok(ranges.some(range => range.start <= weight && range.end >= weight),
      `Roboto ${weight} must be available without loading a route-specific widget`)
  }
  assert.equal(roboto.searchParams.get('display'), 'swap', 'Text must not wait for the font download')
})
