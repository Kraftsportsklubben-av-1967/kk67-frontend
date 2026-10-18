import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})
after(() => server.close())
const { default: Navbar } = await server.ssrLoadModule('/src/components/Navbar/index.vue')
const { default: Desktop } = await server.ssrLoadModule('/src/components/Navbar/NavbarDesktop.vue')
const { default: MobileOverlay } = await server.ssrLoadModule('/src/components/Navbar/NavbarMobileOverlay.vue')
const { default: Menu } = await server.ssrLoadModule('/src/components/Menu/Menu.vue')
const buttons = Navbar.data().buttons

async function render(component, props, path = '/nm') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: {} },
      ...buttons.map(button => ({ path: button.path, component: {} })),
    ],
  })
  await router.push(path)
  await router.isReady()
  return renderToString(createSSRApp(component, props).use(router))
}

function links(html) {
  return [...html.matchAll(/<a\b([^>]*)><strong[^>]*>([^<]*)<\/strong><\/a>/g)]
    .map(([, attributes, title]) => ({
      title,
      href: attributes.match(/href="([^"]+)"/)?.[1],
      classes: attributes.match(/class="([^"]+)"/)?.[1].split(' ') ?? [],
    }))
}

test('desktop keeps every link in order in a single row with a nonshrinking logo', async () => {
  const html = await render(Desktop, { navbarButtons: buttons })
  assert.deepEqual(links(html).map(({ title, href }) => ({ title, path: href })),
    buttons.map(({ title, path }) => ({ title, path })))
  assert.match(html, /class="[^"]*\bflex-nowrap\b/)
  assert.doesNotMatch(html, /\bflex-wrap\b/)
  assert.match(html, /class="shrink-0"[^>]*><img/)
})

test('only desktop buttons opt into compact text and link borders', async () => {
  const html = await render(Desktop, { navbarButtons: buttons })
  assert.equal((html.match(/\btext-sm\b/g) ?? []).length, buttons.length)
  assert.ok(links(html).every(link => link.classes.includes('router-link-compact')))
  assert.doesNotMatch(html, /\btext-lg\b|\blg:p-3\b|\bmx-1\b/)
})

test('mobile overlay and sidebar keep the original larger button style', async () => {
  const mobile = await render(MobileOverlay, { navbarButtons: buttons })
  const sidebar = await render(Menu, { buttons: [], showJoinButton: true, currentPath: '/about' })
  for (const [html, count] of [[mobile, buttons.length], [sidebar, 1]]) {
    assert.equal((html.match(/\bp-2 lg:p-3 text-lg\b/g) ?? []).length, count)
    assert.doesNotMatch(html, /\btext-sm\b|\brouter-link-compact\b/)
  }
  assert.deepEqual(links(mobile).map(link => link.href), buttons.map(button => button.path))
  assert.ok(links(mobile).find(link => link.href === '/join').classes.includes('bg-white'))
  assert.ok(links(sidebar)[0].classes.includes('bg-black'))
})

test('compact links retain active, membership and home-page colours', async () => {
  const normal = await render(Desktop, { navbarButtons: buttons })
  const home = await render(Desktop, { navbarButtons: buttons }, '/')
  const normalLinks = links(normal)
  const homeLinks = links(home)
  assert.ok(normalLinks.find(link => link.href === '/nm').classes.includes('bg-red-700'))
  assert.ok(normalLinks.find(link => link.href === '/join').classes.includes('bg-black'))
  assert.ok(homeLinks.find(link => link.href === '/join').classes.includes('bg-white'))
  assert.ok(homeLinks.filter(link => link.href !== '/join')
    .every(link => link.classes.includes('text-white')))
  assert.match(normal, /src="\/public\/logo\/kk-logo\.png"/)
  assert.match(home, /src="\/public\/logo\/kk-logo-white\.png"/)
})
