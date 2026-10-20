import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, mock, test } from 'node:test'
import vue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const storage = new Map()
let vite
let loadIGPosts
let loadPosts
let ContentCard
let sessionPostsKey

before(async () => {
  globalThis.window = {
    location: { hostname: 'localhost' },
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  }
  vite = await createServer({
    configFile: false,
    plugins: [vue()],
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  ;({ loadIGPosts } = await vite.ssrLoadModule('/src/loaders/instagramLoader.ts'))
  ;({ loadPosts } = await vite.ssrLoadModule('/src/loaders/loadData.ts'))
  ;({ default: ContentCard } = await vite.ssrLoadModule('/src/components/Card/ContentCard.vue'))
  ;({ SESSION_POSTS_KEY: sessionPostsKey } = await vite.ssrLoadModule('/src/constants/sess_keys.ts'))
})

beforeEach(() => storage.clear())
afterEach(() => mock.restoreAll())
after(async () => {
  await vite?.close()
  delete globalThis.window
})

function instagramPost(overrides = {}) {
  return {
    id: 'ig-post',
    media_type: 'IMAGE',
    media_url: 'https://example.com/photo.jpg',
    timestamp: '2026-10-10T12:00:00+0000',
    permalink: 'https://example.com/instagram-post',
    ...overrides,
  }
}

function mockInstagram(posts = []) {
  return mock.method(globalThis, 'fetch', async (url) => {
    if (url.endsWith('/posts/ig/')) {
      return Response.json({
        name: 'Test profile',
        profile_picture_url: 'https://example.com/profile.jpg',
        media: { data: posts },
      })
    }
    throw new Error(`Unexpected feed URL: ${url}`)
  })
}

for (const [label, overrides] of [
  ['missing', {}],
  ['null', { caption: null }],
  ['empty', { caption: '' }],
]) {
  test(`preserves Instagram media when its caption is ${label}`, async () => {
    const post = instagramPost(overrides)
    mockInstagram([post])

    const [card] = await loadIGPosts()

    assert.equal(card.id, post.id)
    assert.deepEqual(card.media, [{ type: 'IMAGE', src: post.media_url }])
    assert.equal(card.text, '')
    assert.equal(card.url, post.permalink)
    assert.deepEqual(card.date, new Date(post.timestamp))
  })
}

test('retains every usable album image and video in order and skips entries without a media type', async () => {
  const children = [
    { media_type: 'VIDEO', media_url: 'https://example.com/child.mp4' },
    { media_type: 'IMAGE' },
    { media_type: 'IMAGE', media_url: 'https://example.com/child.jpg' },
    { media_type: 'IMAGE', media_url: 'https://example.com/second.jpg' },
  ]
  const post = instagramPost({
    caption: 'Captioned carousel',
    media_type: 'CAROUSEL_ALBUM',
    children: { data: children },
  })
  mockInstagram([post, instagramPost({ id: 'no-media', media_type: undefined })])

  const cards = await loadIGPosts()

  assert.equal(cards.length, 1)
  assert.equal(cards[0].text, post.caption)
  assert.deepEqual(cards[0].media, [
    { type: 'VIDEO', src: children[0].media_url },
    { type: 'IMAGE', src: children[2].media_url },
    { type: 'IMAGE', src: children[3].media_url },
  ])
  assert.equal(cards[0].title, 'Test profile')
  assert.equal(cards[0].profileUrl, 'https://example.com/profile.jpg')
  assert.deepEqual(Object.keys(cards[0]).sort(), [
    'date', 'href', 'id', 'media', 'profileUrl', 'text', 'title', 'url',
  ])
})

for (const [label, children] of [
  ['missing children', undefined],
  ['empty children', { data: [] }],
]) {
  test(`keeps an album with ${label} as a link card`, async () => {
    const post = instagramPost({ media_type: 'CAROUSEL_ALBUM', children })
    mockInstagram([post])

    const [card] = await loadIGPosts()

    assert.equal(card.id, post.id)
    assert.deepEqual(card.media, [])
    assert.equal(card.url, post.permalink)
  })
}

test('retains native video sources rather than reducing videos to link cards', async () => {
  const post = instagramPost({
    media_type: 'VIDEO',
    media_url: 'https://example.com/clip.mp4',
    caption: 'Video update',
  })
  mockInstagram([post])

  const [card] = await loadIGPosts()

  assert.deepEqual(card.media, [{ type: 'VIDEO', src: post.media_url }])
  assert.equal(card.text, post.caption)
  assert.equal(card.url, post.permalink)
})

test('loads only Instagram and retains posts with the same caption prefix in date order', async () => {
  const fetch = mockInstagram([
    instagramPost({ id: 'ig-captioned', caption: 'Shared caption one' }),
    instagramPost({ id: 'ig-empty', caption: '', timestamp: '2026-10-11T12:00:00+0000' }),
    instagramPost({ id: 'ig-null', caption: null, timestamp: '2026-10-12T12:00:00+0000' }),
    instagramPost({
      id: 'ig-same-prefix',
      caption: 'Shared caption two',
      timestamp: '2026-10-13T12:00:00+0000',
    }),
  ])

  const cards = await loadPosts()

  assert.deepEqual(
    cards.map((card) => card.id),
    ['ig-same-prefix', 'ig-null', 'ig-empty', 'ig-captioned'],
  )
  assert.ok(cards.every((card) => typeof card.text === 'string'))
  assert.equal(fetch.mock.callCount(), 1)
})

test('restores all image and video sources with dates from the session cache without fetching again', async () => {
  const fetch = mockInstagram([
    instagramPost(),
    instagramPost({ id: 'ig-video', media_type: 'VIDEO', media_url: 'https://example.com/clip.mp4' }),
  ])

  const initial = await loadPosts()
  const cached = await loadPosts()

  assert.equal(storage.size, 1)
  assert.deepEqual(cached, initial)
  assert.ok(cached.every((card) => card.date instanceof Date))
  assert.deepEqual(cached[1].media, [{ type: 'VIDEO', src: 'https://example.com/clip.mp4' }])
  assert.equal(fetch.mock.callCount(), 1)
})

for (const key of ['posts', 'instagram-posts-v1']) {
  test(`does not reuse the incompatible ${key} session cache`, async () => {
    storage.set(key, JSON.stringify([{ id: 'legacy', date: '2026-10-14T12:00:00Z' }]))
    const fetch = mockInstagram([instagramPost()])

    const cards = await loadPosts()

    assert.notEqual(sessionPostsKey, key)
    assert.deepEqual(cards.map((card) => card.id), ['ig-post'])
    assert.equal(fetch.mock.callCount(), 1)
  })
}

test('propagates Instagram fetch failures without caching an empty feed', async () => {
  const failure = new Error('Feed request failed')
  mock.method(globalThis, 'fetch', async () => {
    throw failure
  })

  await assert.rejects(loadPosts, failure)
  assert.equal(storage.size, 0)
})

for (const [label, overrides, mediaType, src] of [
  ['image', {}, 'img', 'https://example.com/photo.jpg'],
  ['album', {
    caption: 'Album update',
    media_type: 'CAROUSEL_ALBUM',
    children: {
      data: [
        { media_type: 'VIDEO', media_url: 'https://example.com/child.mp4' },
        { media_type: 'IMAGE', media_url: 'https://example.com/child.jpg' },
        { media_type: 'IMAGE', media_url: 'https://example.com/second.jpg' },
      ],
    },
  }, 'video', 'https://example.com/child.mp4'],
  ['video', {
    caption: 'Video update',
    media_type: 'VIDEO',
    media_url: 'https://example.com/clip.mp4',
  }, 'video', 'https://example.com/clip.mp4'],
]) {
  test(`renders native ${label} media with a date and original-post link, without embeds`, async () => {
    const post = instagramPost(overrides)
    mockInstagram([post])
    const [card] = await loadIGPosts()

    const html = await renderToString(createSSRApp(ContentCard, { card }))
    assert.ok(html.includes(`src="${src}"`))
    assert.match(html, new RegExp(`<${mediaType}\\b[^>]*src="${src.replaceAll('.', '\\.')}"`))
    if (mediaType === 'video') {
      assert.match(html, /<video\b[^>]*controls[^>]*playsinline[^>]*preload="metadata"/)
      assert.doesNotMatch(html, /autoplay/)
    }
    assert.ok(html.includes(`href="${post.permalink}"`))
    assert.ok(html.includes(`datetime="${new Date(post.timestamp).toISOString()}"`))
    assert.doesNotMatch(html, /<(?:iframe|script)\b/)
    if (label === 'album') {
      assert.match(html, /aria-label="Forrige medie"[^>]*disabled/)
      assert.match(html, /aria-label="Neste medie"/)
      assert.equal([...html.matchAll(/aria-label="Vis medie \d+"/g)].length, 3)
    }
    if (post.caption) assert.ok(html.includes(post.caption))
    else assert.doesNotMatch(html, /<p>\s*<\/p>/)
  })
}

test('renders every position of a mixed image/video album', async () => {
  const children = [
    { media_type: 'VIDEO', media_url: 'https://example.com/first.mp4' },
    { media_type: 'IMAGE', media_url: 'https://example.com/second.jpg' },
    { media_type: 'VIDEO', media_url: 'https://example.com/third.mp4' },
  ]
  mockInstagram([instagramPost({ media_type: 'CAROUSEL_ALBUM', children: { data: children } })])
  const [card] = await loadIGPosts()
  for (let mediaIndex = 0; mediaIndex < children.length; mediaIndex++) {
    const component = { ...ContentCard, data: () => ({ mediaIndex, mediaFailed: false, touchStartX: null }) }
    const html = await renderToString(createSSRApp(component, { card }))
    assert.ok(html.includes(`src="${children[mediaIndex].media_url}"`))
    assert.match(html, new RegExp(`${mediaIndex + 1} / 3`))
  }
})

test('video-only albums retain native playback and navigation', async () => {
  mockInstagram([instagramPost({ media_type: 'CAROUSEL_ALBUM', children: { data: [
    { media_type: 'VIDEO', media_url: 'https://example.com/first.mp4' },
    { media_type: 'VIDEO', media_url: 'https://example.com/second.mp4' },
  ] } })])
  const [card] = await loadIGPosts()
  assert.equal(card.media.length, 2)
  assert.ok(card.media.every(item => item.type === 'VIDEO'))
  const html = await renderToString(createSSRApp(ContentCard, { card }))
  assert.match(html, /<video\b/)
  assert.match(html, /aria-label="Neste medie"/)
})

test('missing media leaves a usable original-post link without a broken player', async () => {
  mockInstagram([instagramPost({ media_url: undefined })])
  const [card] = await loadIGPosts()
  const html = await renderToString(createSSRApp(ContentCard, { card }))
  assert.ok(html.includes(`href="${card.url}"`))
  assert.doesNotMatch(html, /<figure|<video|role="alert"/)
  assert.equal([...html.matchAll(/<img\b/g)].length, 1)
})

test('a failed media item has a visible warning and the original Instagram link', async () => {
  mockInstagram([instagramPost()])
  const [card] = await loadIGPosts()
  const component = { ...ContentCard, data: () => ({ mediaIndex: 0, mediaFailed: true, touchStartX: null }) }
  const html = await renderToString(createSSRApp(component, { card }))
  assert.match(html, /role="alert"/)
  assert.match(html, /Mediet kunne ikke lastes/)
  assert.ok(html.includes(`href="${card.url}"`))
})

test('an empty successful feed is not cached and recovery fetches new posts', async () => {
  const fetch = mockInstagram()
  assert.deepEqual(await loadPosts(), [])
  assert.equal(storage.size, 0)
  fetch.mock.restore()
  const recovered = mockInstagram([instagramPost()])
  assert.equal((await loadPosts()).length, 1)
  assert.equal(recovered.mock.callCount(), 1)
})

for (const cached of ['{broken', '[]', '[{"id":"incomplete"}]']) {
  test(`ignores unusable cached data (${cached}) and fetches a fresh feed`, async () => {
    storage.set(sessionPostsKey, cached)
    const warning = mock.method(console, 'warn', () => {})
    const fetch = mockInstagram([instagramPost()])
    const cards = await loadPosts()
    assert.deepEqual(cards.map(card => card.id), ['ig-post'])
    assert.equal(fetch.mock.callCount(), 1)
    assert.equal(warning.mock.callCount(), 1)
  })
}

test('invalid cached dates are rejected before they can break card rendering', async () => {
  const fetch = mockInstagram([instagramPost()])
  const cards = await loadPosts()
  storage.set(sessionPostsKey, JSON.stringify([{ ...cards[0], date: 'invalid-date' }]))
  mock.method(console, 'warn', () => {})
  assert.ok(Number.isFinite((await loadPosts())[0].date.getTime()))
  assert.equal(fetch.mock.callCount(), 2)
})

for (const [operation, errorName] of [['getItem', 'SecurityError'], ['setItem', 'QuotaExceededError']]) {
  test(`keeps the feed usable when session storage ${operation} fails`, async () => {
    const warning = mock.method(console, 'warn', () => {})
    mock.method(window.sessionStorage, operation, () => { throw new DOMException('Storage unavailable', errorName) })
    mockInstagram([instagramPost()])
    assert.equal((await loadPosts()).length, 1)
    assert.equal(warning.mock.callCount(), 1)
  })
}

for (const [label, response] of [
  ['HTTP error with otherwise valid data', () => Response.json({ name: 'Fixture', profile_picture_url: 'https://example.com/profile.jpg', media: { data: [] } }, { status: 500 })],
  ['non-JSON success', () => new Response('<html>Not a feed</html>')],
  ['Graph error envelope', () => Response.json({ media: { error: { message: 'Fixture' } } })],
  ['missing data array', () => Response.json({ name: 'Fixture', profile_picture_url: 'https://example.com/profile.jpg', media: {} })],
]) {
  test(`rejects ${label} without caching a fake successful result`, async () => {
    mock.method(globalThis, 'fetch', async () => response())
    await assert.rejects(loadPosts)
    assert.equal(storage.size, 0)
  })
}

test('rejects invalid post dates before rendering', async () => {
  mockInstagram([instagramPost({ timestamp: 'invalid-date' })])
  await assert.rejects(loadPosts, /Instagram/)
  assert.equal(storage.size, 0)
})

test('a stalled request is aborted after thirty seconds', async () => {
  mock.timers.enable({ apis: ['setTimeout'] })
  let signal
  mock.method(globalThis, 'fetch', (_url, options) => {
    signal = options.signal
    return new Promise((resolve, reject) => {
      signal?.addEventListener('abort', () => reject(signal.reason), { once: true })
    })
  })
  const pending = loadIGPosts()
  try {
    assert.ok(signal, 'The feed request must have an abort signal')
    const failure = assert.rejects(pending, error => error.name === 'AbortError')
    mock.timers.tick(30000)
    await failure
  } finally {
    mock.timers.reset()
  }
})
