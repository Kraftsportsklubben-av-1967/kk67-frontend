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
const driveFileId = '1Cl_886a7x9OLlyh49ZaFq_A1qHR-R8mB'
const youtubeVideoId = 'M7lc1UVf-VE'

function renderVideo(props, loaded = false) {
  const component = loaded ? { ...EventVideo, data: () => ({ loaded: true }) } : EventVideo
  return renderToString(createSSRApp(component, { title: 'NM i styrkeløft 2027', ...props }))
}

test('shows the coming-soon state when neither provider is configured', async () => {
  const html = await renderVideo({})
  assert.match(html, /Video kommer/)
  assert.doesNotMatch(html, /<iframe|<button|<a /)
})

test('offers Drive without embedding external content before activation', async () => {
  const html = await renderVideo({ driveFileId })
  assert.match(html, /<button[^>]*type="button"/)
  assert.match(html, /Innhold fra Google Drive hentes først/)
  assert.doesNotMatch(html, /<iframe|<img|drive\.google\.com/)
})

test('prefers YouTube when both providers are configured', async () => {
  const html = await renderVideo({ driveFileId, youtubeVideoId })
  assert.match(html, /Innhold fra YouTube hentes først/)
  assert.doesNotMatch(html, /Google Drive|<iframe|<img|youtube-nocookie\.com/)
})

test('the activated Drive player uses a file preview and a direct-view fallback', async () => {
  const html = await renderVideo({ driveFileId }, true)
  assert.ok(html.includes(`src="https://drive.google.com/file/d/${driveFileId}/preview"`))
  assert.ok(html.includes(`href="https://drive.google.com/file/d/${driveFileId}/view"`))
  assert.match(html, /title="NM i styrkeløft 2027"/)
  assert.match(html, /allowfullscreen/)
  assert.match(html, /rel="noopener noreferrer"/)
  assert.doesNotMatch(html, /youtube/)
})

test('the activated YouTube player still uses the privacy-enhanced domain', async () => {
  const html = await renderVideo({ driveFileId, youtubeVideoId }, true)
  assert.ok(html.includes(`src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}"`))
  assert.doesNotMatch(html, /drive\.google\.com/)
})
