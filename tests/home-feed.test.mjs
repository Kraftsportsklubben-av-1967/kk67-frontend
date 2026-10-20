import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, mock, test } from 'node:test'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createServer } from 'vite'

const storage = new Map()
let server
let Content

before(async () => {
  globalThis.window = {
    location: { hostname: 'localhost' },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    scrollTo: () => {},
  }
  server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom', optimizeDeps: { noDiscovery: true },
  })
  ;({ default: Content } = await server.ssrLoadModule('/src/views/Home/Content.vue'))
})
beforeEach(() => storage.clear())
afterEach(() => mock.restoreAll())
after(async () => {
  await server?.close()
  delete globalThis.window
})

function response(count = 0) {
  return Response.json({
    name: 'Fixture profile', profile_picture_url: 'https://example.com/profile.jpg',
    media: { data: Array.from({ length: count }, (_, index) => ({
      id: `post-${index}`, media_type: 'IMAGE', media_url: 'https://example.com/photo.jpg',
      timestamp: `2026-10-${String(index + 1).padStart(2, '0')}T12:00:00Z`,
      permalink: `https://example.com/post-${index}`,
    })) },
  })
}

function state() {
  const result = Content.data()
  for (const [name, method] of Object.entries(Content.methods)) result[name] = method.bind(result)
  for (const [name, getter] of Object.entries(Content.computed ?? {})) {
    Object.defineProperty(result, name, { get: () => getter.call(result) })
  }
  return result
}

function render(current) {
  const data = Object.fromEntries(Object.entries(current).filter(([, value]) => typeof value !== 'function'))
  return renderToString(createSSRApp({ ...Content, created: undefined, data: () => data }))
}

test('an empty feed renders an explicit empty state and a retry button instead of a spinner', async () => {
  mock.method(globalThis, 'fetch', async () => response())
  const current = state()
  await Content.created.call(current)
  const html = await render(current)
  assert.match(html, /Ingen Instagram-innlegg/)
  assert.match(html, /<button[^>]*>\s*Pr\u00f8v igjen\s*<\/button>/)
  assert.doesNotMatch(html, /\bloader\b/)
  assert.equal(current.loading, false)
})

test('a rejected request becomes a visible error and a successful retry replaces it', async () => {
  const failure = new Error('Synthetic network failure')
  const fetch = mock.method(globalThis, 'fetch', async () => { throw failure })
  const log = mock.method(console, 'error', () => {})
  const current = state()
  await Content.created.call(current)
  const failed = await render(current)
  assert.match(failed, /role="alert"/)
  assert.match(failed, /kunne ikke lastes/)
  assert.doesNotMatch(failed, /\bloader\b/)
  assert.equal(log.mock.callCount(), 1)
  fetch.mock.mockImplementation(async () => response(4))
  await current.loadFeed()
  const recovered = await render(current)
  assert.equal(current.cards.length, 4)
  assert.deepEqual(current.pages.map(page => page.length), [0, 3, 1])
  assert.equal(current.currentPage, 1)
  assert.equal([...recovered.matchAll(/<article\b/g)].length, 3)
  assert.doesNotMatch(recovered, /role="alert"|\bloader\b/)
})

test('an empty result can be retried and rebuilt without duplicate pages', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => response())
  const current = state()
  await Content.created.call(current)
  fetch.mock.mockImplementation(async () => response(7))
  await current.loadFeed()
  await current.loadFeed()
  assert.deepEqual(current.pages.map(page => page.length), [0, 3, 3, 1])
  assert.equal(fetch.mock.callCount(), 2, 'The successful feed can still be cached')
})

test('loading is visible only while pending and overlapping retries do not duplicate requests', async () => {
  let complete
  const fetch = mock.method(globalThis, 'fetch', () => new Promise(resolve => { complete = resolve }))
  const current = state()
  const pending = Content.created.call(current)
  try {
    const html = await render(current)
    assert.equal(current.loading, true)
    assert.match(html, /aria-busy="true"/)
    assert.match(html, /role="status"/)
    assert.match(html, /Laster Instagram-innlegg/)
    await current.loadFeed()
    assert.equal(fetch.mock.callCount(), 1)
  } finally {
    complete(response(1))
    await pending
  }
  assert.equal(current.loading, false)
})
