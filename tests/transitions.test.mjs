import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { parse } from '@vue/compiler-sfc'
import postcss from 'postcss'
import { createServer } from 'vite'

const originalWindow = globalThis.window
globalThis.window = { location: { hostname: 'localhost' } }
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})
after(async () => {
  await server.close()
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})
const { default: ViewTransition } = await server.ssrLoadModule('/src/components/ViewTransition.vue')
const { default: App } = await server.ssrLoadModule('/src/App.vue')
const source = await readFile(new URL('../src/components/ViewTransition.vue', import.meta.url), 'utf8')
const css = postcss.parse(parse(source).descriptor.styles[0].content)

function declaration(container, selector, property) {
  const rule = container.nodes.find(node =>
    node.type === 'rule' && node.selector.split(',').some(item => item.trim() === selector)
    && node.nodes.some(item => item.prop === property))
  return rule?.nodes.find(node => node.prop === property)?.value
}

test('the shared transition renders visible slot content without animating its initial mount', async () => {
  const html = await renderToString(createSSRApp({
    render: () => h(ViewTransition, { viewKey: 'about' }, () => h('p', 'Page content')),
  }))
  assert.match(html, /class="view-content"/)
  assert.match(html, /<p>Page content<\/p>/)
  assert.doesNotMatch(html, /enter-active|enter-from|style=/)
})

test('subpages use the same host with a distinct motion variant', async () => {
  const html = await renderToString(createSSRApp({
    render: () => h(ViewTransition, { viewKey: '/about/members', subpage: true }, () => 'Subpage'),
  }))
  assert.match(html, /class="view-content view-content--subpage"/)
  assert.match(html, /Subpage/)
})

test('outgoing views finish synchronously instead of queuing animations', () => {
  let finished = 0
  ViewTransition.methods.leaveImmediately({}, () => finished++)
  assert.equal(finished, 1)
})

test('main views fade and rise twelve pixels over 240ms', () => {
  const transition = declaration(css, '.page-view-enter-active', 'transition')
  assert.match(transition, /opacity 240ms/)
  assert.match(transition, /transform 240ms/)
  assert.equal(declaration(css, '.page-view-enter-from', 'opacity'), '0')
  assert.equal(declaration(css, '.page-view-enter-from', 'transform'), 'translateY(12px)')
})

test('subpage motion is shorter and smaller', () => {
  assert.equal(declaration(css, '.subpage-view-enter-active', 'transition-duration'), '180ms')
  assert.equal(declaration(css, '.subpage-view-enter-from', 'transform'), 'translateY(8px)')
})

test('reduced motion removes both displacement and fading', () => {
  const reduced = css.nodes.find(node =>
    node.type === 'atrule' && node.name === 'media' && node.params === '(prefers-reduced-motion: reduce)')
  assert.ok(reduced)
  for (const name of ['page-view', 'subpage-view']) {
    assert.equal(declaration(reduced, `.${name}-enter-active`, 'transition'), 'none')
    assert.equal(declaration(reduced, `.${name}-enter-from`, 'transform'), 'none')
    assert.equal(declaration(reduced, `.${name}-enter-from`, 'opacity'), '1')
  }
})

test('the settled wrapper introduces no width, clipping or transformed containing block', () => {
  assert.equal(declaration(css, '.view-content', 'min-width'), '0')
  for (const property of ['width', 'max-width', 'height', 'overflow', 'transform', 'will-change']) {
    assert.equal(declaration(css, '.view-content', property), undefined)
  }
})

test('root view identity follows the section, including both kinds of FAQ route', () => {
  const key = path => App.computed.pageKey.call({ $route: { path } })
  assert.equal(key('/'), '')
  assert.equal(key('/about'), key('/about/trainers'))
  assert.equal(key('/faq/1'), key('/faq/2'))
  assert.equal(key('/faq/1'), key('/faq/guidelines'))
  assert.equal(key('/records'), key('/records/bench'))
  assert.notEqual(key('/nm'), key('/about'))
})

for (const [name, route] of [
  ['About', { path: '/about/trainers' }],
  ['Schedule', { path: '/schedule/meets' }],
  ['Records', { path: '/records/bench' }],
  ['Meets', { path: '/meets/previousMeets', name: 'PreviousMeets' }],
  ['Faq', { path: '/faq/1', params: { qid: '1' } }],
  ['Faq', { path: '/faq/guidelines', params: {} }],
]) {
  test(`${route.path} animates its content without wrapping the sidebar`, async () => {
    const { default: Page } = await server.ssrLoadModule(`/src/views/${name}/index.vue`)
    const app = createSSRApp({
      ...Page,
      components: {
        ...Page.components,
        Menu: { render: () => h('nav', 'Sidebar navigation') },
        RouterView: { render: () => h('p', 'Nested content') },
      },
    })
    app.config.globalProperties.$route = { params: {}, matched: [{ children: [{}] }], ...route }
    app.component('RouterLink', { render() { return h('a', this.$slots.default?.()) } })
    const html = await renderToString(app)
    assert.match(html, /view-content--subpage/)
    assert.ok(html.indexOf('view-content') > html.indexOf('</aside>'), 'The sidebar must remain outside subpage motion')
    assert.match(html, /Sidebar navigation/)
    if (route.params?.qid) assert.match(html, /Hva er KK-67/)
    else assert.match(html, /Nested content/)
  })
}

test('the full-screen gallery is teleported outside transformed route content', async () => {
  const pictures = await readFile(new URL('../src/views/Pictures/index.vue', import.meta.url), 'utf8')
  assert.match(pictures, /<Teleport to="body">[\s\S]*?<PictureOverlay[\s\S]*?<\/Teleport>/)
})
