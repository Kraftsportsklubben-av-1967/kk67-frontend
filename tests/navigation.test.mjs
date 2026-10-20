import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import postcss from 'postcss'
import { createSSRApp, h } from 'vue'
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
const { default: Header } = await server.ssrLoadModule('/src/components/Header.vue')
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
  assert.ok(html.includes('gap-3'), 'Desktop links need 12px gaps between buttons')
  assert.ok(html.includes('min-w-max'), 'The row must expose its full width before it is shown')
  assert.doesNotMatch(html, /\bflex-wrap\b/)
  assert.match(html, /class="[^"]*\bshrink-0\b[^"]*"[^>]*><img/)
})

test('desktop buttons use 16px text and compact link borders', async () => {
  const html = await render(Desktop, { navbarButtons: buttons })
  assert.equal((html.match(/\btext-base\b/g) ?? []).length, buttons.length)
  assert.ok(links(html).every(link => link.classes.includes('router-link-compact')))
  assert.doesNotMatch(html, /\btext-sm\b|\btext-lg\b|\blg:p-3\b|\bmx-1\b/)
})

test('mobile overlay and sidebar keep the original larger button style', async () => {
  const mobile = await render(MobileOverlay, { navbarButtons: buttons })
  const sidebar = await render(Menu, { buttons: [], showJoinButton: true, currentPath: '/about' })
  for (const [html, count] of [[mobile, buttons.length], [sidebar, 1]]) {
    assert.equal((html.match(/\bp-2 lg:p-3 text-lg\b/g) ?? []).length, count)
    assert.doesNotMatch(html, /\btext-sm\b|\btext-base\b|\brouter-link-compact\b/)
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

test('all navigation shares the content gutters, with a black homepage strip and light headers elsewhere', async () => {
  // Isolate the header's layout from navigation measurement.
  const header = { ...Header, components: { ...Header.components, Navbar: { render: () => h('nav') } } }
  const home = await render(header, {}, '/')
  const normal = await render(header, {})
  assert.ok(home.indexOf('</nav>') < home.indexOf('background-image'),
    'The homepage photo must sit below the navigation, not behind it')
  for (const html of [home, normal]) {
    assert.ok(html.includes('class="main-container px-8"'), 'Every header must share the main content gutters')
  }
  assert.doesNotMatch(home + normal, /md:w-5\/6|md:mx-auto/)
  assert.doesNotMatch(home + normal, /max-w-screen-2xl/)
  assert.match(home, /background-color:\s*black/)
  assert.match(normal, /background-color:\s*white/)
  assert.doesNotMatch(normal, /background-image/)
})

test('keeps the measuring row hidden and inert until the available width is known', async () => {
  const html = await render(Navbar, {})
  assert.match(html, /class="[^"]*\binvisible\b[^"]*\boverflow-hidden\b[^"]*"[^>]*aria-hidden="true"[^>]*inert/)
  assert.match(html, /class="[^"]*\bhamburger-container\b/)
})

test('homepage photo fills the content gutters without changing its responsive height', async () => {
  const source = await readFile(new URL('../src/components/Header.vue', import.meta.url), 'utf8')
  const stylesheet = postcss.parse(source.match(/<style>([\s\S]*?)<\/style>/)[1])
  const declarations = rule => Object.fromEntries(rule.nodes
    .filter(node => node.type === 'decl').map(node => [node.prop, node.value]))
  const frame = declarations(stylesheet.nodes.find(node => node.selector === '.background-image'))
  const photo = stylesheet.nodes.find(node => node.selector === '.background-image::before')
  assert.ok(photo, 'The crop must be independent of the frame that provides the existing height')
  assert.equal(frame.position, 'relative')
  assert.equal(frame['padding-top'], '7rem')
  assert.equal(frame['padding-bottom'], '30%')
  assert.equal(frame['background-image'], undefined, 'The photo must not paint outside the content gutters')
  const image = declarations(photo)
  assert.equal(image.content, "''")
  assert.equal(image.position, 'absolute')
  assert.equal(image.inset, '0 2rem', 'The photo must share the 32px content gutters')
  assert.equal(image['background-size'], 'cover')
  assert.equal(image['background-position'], 'center')
  assert.equal(image['background-image'], 'url(/public/logo/header.jpg)')
  assert.deepEqual(stylesheet.nodes.filter(node => node.type === 'atrule' && node.name === 'media')
    .map(media => [media.params, declarations(media.nodes.find(node => node.selector === '.background-image'))]), [
    ['(min-width: 1231px)', { 'padding-top': '6rem' }],
    ['(min-width: 1280px)', { 'padding-bottom': '26%' }],
    ['(min-width: 1536px)', { 'padding-bottom': '21.5%' }],
  ])
})
