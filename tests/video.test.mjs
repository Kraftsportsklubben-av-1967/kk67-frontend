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
const { default: EventVideo } = await server.ssrLoadModule('/src/components/Media/EventVideo.vue')
const mp4Url = '/public/videos/nm-2027-promo.mp4'
const youtubeVideoId = 'M7lc1UVf-VE'

function renderVideo(props, state) {
  const component = state ? { ...EventVideo, data: () => ({ loaded: false, failed: false, ...state }) } : EventVideo
  return renderToString(createSSRApp(component, { title: 'NM i styrkeløft 2027', ...props }))
}

test('shows the coming-soon state when neither provider is configured', async () => {
  const html = await renderVideo({})
  assert.match(html, /Video kommer/)
  assert.doesNotMatch(html, /<video|<iframe|<button|<a /)
})

test('uses the local MP4 with native controls and metadata-only preloading', async () => {
  const html = await renderVideo({ mp4Url })
  assert.ok(html.includes(`src="${mp4Url}"`))
  assert.match(html, /<video[^>]*controls[^>]*playsinline[^>]*preload="metadata"/)
  assert.match(html, /aria-label="NM i styrkeløft 2027"/)
  assert.doesNotMatch(html, /<iframe|autoplay|youtube|drive\.google\.com|role="alert"/)
})

test('prefers YouTube when both providers are configured', async () => {
  const html = await renderVideo({ mp4Url, youtubeVideoId })
  assert.match(html, /Innhold fra YouTube hentes først/)
  assert.doesNotMatch(html, /<video|<iframe|<img|youtube-nocookie\.com/)
  assert.ok(!html.includes(mp4Url))
})

test('reports a failed local video instead of leaving a silent empty player', async () => {
  const html = await renderVideo({ mp4Url }, { failed: true })
  assert.match(html, /role="alert"/)
  assert.match(html, /Videoen kunne ikke lastes/)
  assert.doesNotMatch(html, /youtube/)
})

test('the activated YouTube player still uses the privacy-enhanced domain', async () => {
  const html = await renderVideo({ mp4Url, youtubeVideoId }, { loaded: true })
  assert.ok(html.includes(`src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}"`))
  assert.ok(html.includes(`href="https://www.youtube.com/watch?v=${youtubeVideoId}"`))
  assert.match(html, /title="NM i styrkeløft 2027"/)
  assert.match(html, /allowfullscreen/)
  assert.match(html, /rel="noopener noreferrer"/)
  assert.doesNotMatch(html, /<video|drive\.google\.com/)
  assert.ok(!html.includes(mp4Url))
})
