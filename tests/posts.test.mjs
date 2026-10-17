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
    assert.equal(card.src, post.media_url)
    assert.equal(card.text, '')
    assert.equal(card.url, post.permalink)
    assert.deepEqual(card.date, new Date(post.timestamp))
  })
}

test('uses the first available album photo and skips entries without a media type', async () => {
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
  assert.equal(cards[0].src, children[2].media_url)
  assert.equal(cards[0].title, 'Test profile')
  assert.equal(cards[0].profileUrl, 'https://example.com/profile.jpg')
  assert.deepEqual(Object.keys(cards[0]).sort(), [
    'date', 'href', 'id', 'profileUrl', 'src', 'text', 'title', 'url',
  ])
})

for (const [label, children] of [
  ['missing children', undefined],
  ['empty children', { data: [] }],
  ['video-only children', {
    data: [{ media_type: 'VIDEO', media_url: 'https://example.com/child.mp4' }],
  }],
]) {
  test(`keeps an album with ${label} as a link card`, async () => {
    const post = instagramPost({ media_type: 'CAROUSEL_ALBUM', children })
    mockInstagram([post])

    const [card] = await loadIGPosts()

    assert.equal(card.id, post.id)
    assert.equal(card.src, undefined)
    assert.equal(card.url, post.permalink)
  })
}

test('keeps video posts as link cards without using video URLs as images', async () => {
  const post = instagramPost({
    media_type: 'VIDEO',
    media_url: 'https://example.com/clip.mp4',
    caption: 'Video update',
  })
  mockInstagram([post])

  const [card] = await loadIGPosts()

  assert.equal(card.src, undefined)
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

test('restores image and link cards with dates from the session cache without fetching again', async () => {
  const fetch = mockInstagram([
    instagramPost(),
    instagramPost({ id: 'ig-video', media_type: 'VIDEO', media_url: 'https://example.com/clip.mp4' }),
  ])

  const initial = await loadPosts()
  const cached = await loadPosts()

  assert.equal(storage.size, 1)
  assert.deepEqual(cached, initial)
  assert.ok(cached.every((card) => card.date instanceof Date))
  assert.equal(fetch.mock.callCount(), 1)
})

test('does not reuse the old mixed-provider session cache', async () => {
  storage.set('posts', JSON.stringify([{ id: 'fb-legacy', date: '2026-10-14T12:00:00Z' }]))
  const fetch = mockInstagram([instagramPost()])

  const cards = await loadPosts()

  assert.notEqual(sessionPostsKey, 'posts')
  assert.deepEqual(cards.map((card) => card.id), ['ig-post'])
  assert.equal(fetch.mock.callCount(), 1)
})

test('propagates Instagram fetch failures without caching an empty feed', async () => {
  const failure = new Error('Feed request failed')
  mock.method(globalThis, 'fetch', async () => {
    throw failure
  })

  await assert.rejects(loadPosts, failure)
  assert.equal(storage.size, 0)
})

for (const [label, overrides, preview] of [
  ['image', {}, 'https://example.com/photo.jpg'],
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
  }, 'https://example.com/child.jpg'],
  ['video', {
    caption: 'Video update',
    media_type: 'VIDEO',
    media_url: 'https://example.com/clip.mp4',
  }, undefined],
]) {
  test(`renders a native ${label} card with a date and original-post link, without players or embeds`, async () => {
    const post = instagramPost(overrides)
    mockInstagram([post])
    const [card] = await loadIGPosts()

    const html = await renderToString(createSSRApp(ContentCard, { card }))
    const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1])

    assert.deepEqual(images, [
      'https://example.com/profile.jpg',
      ...(preview ? [preview] : []),
    ])
    assert.ok(html.includes(`href="${post.permalink}"`))
    assert.ok(html.includes(`datetime="${new Date(post.timestamp).toISOString()}"`))
    assert.doesNotMatch(html, /<(?:video|iframe|script|button)\b/)
    assert.doesNotMatch(html, /class="[^"]*\b(?:prev|next|dot|pagination)\b/)
    if (post.caption) assert.ok(html.includes(post.caption))
    else assert.doesNotMatch(html, /<p>\s*<\/p>/)
  })
}
