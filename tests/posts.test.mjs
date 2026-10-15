import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, mock, test } from 'node:test'
import { createServer } from 'vite'

const storage = new Map()
let vite
let loadIGPosts
let loadPosts

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
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  ;({ loadIGPosts } = await vite.ssrLoadModule('/src/loaders/instagramLoader.ts'))
  ;({ loadPosts } = await vite.ssrLoadModule('/src/loaders/loadData.ts'))
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

function facebookPost(overrides = {}) {
  return {
    id: 'fb-post',
    type: 'IMAGE',
    full_picture: 'https://example.com/facebook-photo.jpg',
    created_time: '2026-10-09T12:00:00+0000',
    permalink_url: 'https://example.com/facebook-post',
    message: 'Facebook-only update',
    ...overrides,
  }
}

function mockFeeds(instagram = [], facebook = []) {
  return mock.method(globalThis, 'fetch', async (url) => {
    if (url.endsWith('/posts/ig/')) {
      return Response.json({
        name: 'Test profile',
        profile_picture_url: 'https://example.com/profile.jpg',
        media: { data: instagram },
      })
    }
    if (url.endsWith('/posts/fb/')) {
      return Response.json({
        name: 'Test profile',
        picture: { data: { url: 'https://example.com/profile.jpg' } },
        posts: { data: facebook },
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
    mockFeeds([post])

    const [card] = await loadIGPosts()

    assert.equal(card.id, post.id)
    assert.equal(card.src, post.media_url)
    assert.equal(card.text, '')
    assert.equal(card.comp, `instagram:${post.id}`)
    assert.equal(card.url, post.permalink)
    assert.equal(card.type, post.media_type)
    assert.deepEqual(card.date, new Date(post.timestamp))
    assert.deepEqual(card.carusell, [])
  })
}

test('preserves captioned carousel content and skips entries without a media type', async () => {
  const children = [
    { media_type: 'IMAGE', media_url: 'https://example.com/child.jpg' },
    { media_type: 'VIDEO', media_url: 'https://example.com/child.mp4' },
  ]
  const post = instagramPost({
    caption: 'Captioned carousel',
    media_type: 'CAROUSEL_ALBUM',
    children: { data: children },
  })
  mockFeeds([post, instagramPost({ id: 'no-media', media_type: undefined })])

  const cards = await loadIGPosts()

  assert.equal(cards.length, 1)
  assert.equal(cards[0].text, post.caption)
  assert.equal(cards[0].comp, post.caption.substring(0, 10))
  assert.equal(cards[0].type, post.media_type)
  assert.deepEqual(cards[0].carusell, children)
  assert.equal(cards[0].title, 'Test profile')
  assert.equal(cards[0].profileUrl, 'https://example.com/profile.jpg')
})

test('keeps distinct captionless posts when combining and sorting both feeds', async () => {
  mockFeeds(
    [
      instagramPost({ id: '1234567890', timestamp: '2026-10-12T12:00:00+0000' }),
      instagramPost({ id: 'ig-empty', caption: '', timestamp: '2026-10-11T12:00:00+0000' }),
      instagramPost({ id: 'ig-null', caption: null }),
      instagramPost({ id: 'ig-captioned', caption: '1234567890 caption' }),
    ],
    [facebookPost()],
  )

  const cards = await loadPosts()

  assert.deepEqual(
    cards.map((card) => card.id),
    ['1234567890', 'ig-empty', 'ig-null', 'ig-captioned', 'fb-post'],
  )
  assert.ok(cards.every((card) => typeof card.text === 'string'))
})

test('still deduplicates captioned cross-posts and skips Facebook posts without a message', async () => {
  mockFeeds(
    [instagramPost({ caption: 'Shared caption on Instagram' })],
    [
      facebookPost({ id: 'fb-duplicate', message: 'Shared caption on Facebook' }),
      facebookPost({ id: 'fb-missing', message: undefined }),
      facebookPost({ id: 'fb-empty', message: '' }),
      facebookPost(),
    ],
  )

  assert.deepEqual(
    (await loadPosts()).map((card) => card.id),
    ['ig-post', 'fb-post'],
  )
})

test('restores captionless cards and dates from the session cache without fetching again', async () => {
  const fetch = mockFeeds([instagramPost()], [facebookPost()])

  const initial = await loadPosts()
  const cached = await loadPosts()

  assert.equal(storage.size, 1)
  assert.deepEqual(cached, initial)
  assert.ok(cached.every((card) => card.date instanceof Date))
  assert.equal(fetch.mock.callCount(), 2)
})

for (const provider of ['ig', 'fb']) {
  test(`propagates ${provider} fetch failures without caching an empty feed`, async () => {
    const failure = new Error('Feed request failed')
    const fetch = mockFeeds([instagramPost({ caption: 'A valid caption' })])
    fetch.mock.mockImplementationOnce(
      async () => {
        throw failure
      },
      provider === 'ig' ? 0 : 1,
    )

    await assert.rejects(loadPosts, failure)
    assert.equal(storage.size, 0)
  })
}
