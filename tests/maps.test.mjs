import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
  ssr: { noExternal: ['@googlemaps/js-api-loader'] },
})
after(() => server.close())
const { default: RouteMap } = await server.ssrLoadModule('/src/components/Maps/RouteMap.vue')
const { default: Location } = await server.ssrLoadModule('/src/views/About/Location.vue')
const origin = 'Quality Hotel Prinsen, Kongens gate 30, Trondheim'
const destination = 'Storsalen, Studentersamfundet, Elgeseter gate 1, Trondheim'

function renderMap(mode = 'WALKING', locations = { origin, destination }) {
  const component = {
    ...RouteMap,
    setup(props, context) {
      const state = RouteMap.setup(props, context)
      state.travelMode.value = mode
      return state
    },
  }
  return renderToString(createSSRApp(component, locations))
}

test('offers a named walking/driving radio group with an explicit loading state', async () => {
  const html = await renderMap()
  assert.match(html, /<legend[^>]*>Velg reisemåte<\/legend>/)
  assert.equal((html.match(/type="radio"/g) ?? []).length, 2)
  const names = [...html.matchAll(/type="radio" name="([^"]+)"/g)].map(match => match[1])
  assert.equal(names.length, 2)
  assert.equal(names[0], names[1])
  assert.match(html, /Til fots/)
  assert.match(html, /Med bil/)
  assert.match(html, /aria-busy="true"/)
  assert.match(html, /role="status"/)
  assert.doesNotMatch(html, /role="alert"/)
})

test('external directions preserve both locations and the selected travel mode without an API key', async () => {
  for (const mode of ['WALKING', 'DRIVING']) {
    const html = await renderMap(mode)
    const href = html.match(/href="([^"]+)"/)?.[1]
    assert.ok(href)
    const url = new URL(href.replaceAll('&amp;', '&'))
    assert.equal(url.origin, 'https://www.google.com')
    assert.equal(url.pathname, '/maps/dir/')
    assert.equal(url.searchParams.get('api'), '1')
    assert.equal(url.searchParams.get('origin'), origin)
    assert.equal(url.searchParams.get('destination'), destination)
    assert.equal(url.searchParams.get('travelmode'), mode.toLowerCase())
    assert.equal(url.searchParams.has('key'), false)
    assert.match(html, /rel="noopener noreferrer"/)
  }
})

test('encodes punctuation in place names rather than altering the directions query', async () => {
  const origin = 'Hotel & conference "A"'
  const html = await renderMap('WALKING', { origin, destination })
  const href = html.match(/href="([^"]+)"/)?.[1]
  const url = new URL(href.replaceAll('&amp;', '&'))
  assert.equal(url.searchParams.get('origin'), origin)
  assert.equal(url.searchParams.size, 4)
})

test('always shows the walking beta warning, even before Google returns route-specific warnings', async () => {
  assert.match(await renderMap('WALKING'), /Gangruter er i betaversjon/)
  assert.doesNotMatch(await renderMap('DRIVING'), /Gangruter er i betaversjon/)
})

test('the club location view keeps its address, loading state and independent Google Maps link', async () => {
  const html = await renderToString(createSSRApp(Location))
  assert.match(html, /Hvor finner du oss/)
  assert.match(html, /mellomveien 5/)
  assert.match(html, /role="status"/)
  assert.match(html, /Åpne KK-67 i Google Maps/)
  assert.match(html, /google\.com\/maps\/search\/\?api=1/)
})
