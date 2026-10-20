import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})
after(() => server.close())
const { default: App } = await server.ssrLoadModule('/src/App.vue')
const { default: Layout } = await server.ssrLoadModule('/src/components/Layout.vue')

function classLists(html) {
  return [...html.matchAll(/\bclass="([^"]*)"/g)].map(([, classes]) => new Set(classes.split(' ')))
}

test('the shared main wrapper owns the page gutters', async () => {
  const stub = tag => ({ render: () => h(tag) })
  const shell = { ...App, components: { Header: stub('header'), Footer: stub('footer'), RouterView: stub('section') } }
  const html = await renderToString(createSSRApp(shell))
  assert.match(html, /<main[^>]*><div class="main-container px-8"><section/)
})

test('sidebar layouts fill the shared width without changing column proportions', async () => {
  const html = await renderToString(createSSRApp(Layout))
  const [root, sidebar, main] = classLists(html)
  assert.ok(!root.has('md:w-5/6'), 'A second percentage width must not narrow the page')
  assert.ok(!root.has('md:mx-auto'))
  assert.ok(sidebar.has('lg:w-1/5'))
  assert.ok(main.has('lg:w-[46%]') && main.has('xl:w-[55%]'))
  assert.ok(!sidebar.has('mx-8') && !main.has('mx-8'), 'The shared wrapper already supplies the gutters')
})

test('the homepage retains mobile full-bleed content without shifting its sidebar', async () => {
  const html = await renderToString(createSSRApp(Layout, { fullMain: true }))
  const [, sidebar, main] = classLists(html)
  assert.ok(!sidebar.has('mx-8'))
  assert.ok(main.has('-mx-8'), 'Mobile media must still reach the viewport edges')
  assert.ok(main.has('md:mx-0'), 'Tablet and desktop content must align with the shared gutters')
})
