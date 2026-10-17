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
const { getCountdown } = await server.ssrLoadModule('/src/utils/getCountdown.ts')
const { default: FlipCountdown } = await server.ssrLoadModule('/src/components/Countdown/FlipCountdown.vue')
const targetAt = '2027-06-19T00:00:00+02:00'

test('pads four full-day digits and two digits for each smaller unit', () => {
  assert.deepEqual(getCountdown(targetAt, new Date('2027-06-09T18:57:59Z')), {
    days: '0009', hours: '03', minutes: '02', seconds: '01', expired: false,
  })
})

test('uses full days rather than adding a clock to the old rounded-up calendar count', () => {
  assert.deepEqual(getCountdown(targetAt, new Date('2026-10-17T15:24:28Z')), {
    days: '0244', hours: '06', minutes: '35', seconds: '32', expired: false,
  })
})

test('borrows across seconds, minutes, hours and days without expiring on the last day', () => {
  assert.deepEqual(getCountdown(targetAt, new Date('2027-06-17T22:00:00Z')), {
    days: '0001', hours: '00', minutes: '00', seconds: '00', expired: false,
  })
  assert.deepEqual(getCountdown(targetAt, new Date('2027-06-17T22:00:01Z')), {
    days: '0000', hours: '23', minutes: '59', seconds: '59', expired: false,
  })
})

test('keeps the last second until the exact Norwegian summer-midnight target', () => {
  assert.deepEqual(getCountdown(targetAt, new Date('2027-06-18T21:59:59.999Z')), {
    days: '0000', hours: '00', minutes: '00', seconds: '01', expired: false,
  })
  assert.equal(getCountdown(targetAt, new Date('2027-06-18T22:00:00Z')).expired, true)
})

test('honours a Norwegian winter UTC offset independently of the browser time zone', () => {
  assert.equal(getCountdown('2027-01-03T00:00:00+01:00', new Date('2027-01-02T22:59:59Z')).seconds, '01')
  assert.equal(getCountdown('2027-01-03T00:00:00+01:00', new Date('2027-01-02T23:00:00Z')).expired, true)
})

test('counts actual elapsed time across both daylight-saving transitions', () => {
  assert.deepEqual(getCountdown('2026-10-26T00:00:00+01:00', new Date('2026-10-25T00:00:00+02:00')), {
    days: '0001', hours: '01', minutes: '00', seconds: '00', expired: false,
  })
  assert.deepEqual(getCountdown('2027-03-29T00:00:00+02:00', new Date('2027-03-28T00:00:00+01:00')), {
    days: '0000', hours: '23', minutes: '00', seconds: '00', expired: false,
  })
})

test('includes leap days', () => {
  assert.equal(getCountdown('2028-03-01T00:00:00+01:00', new Date('2028-02-28T00:00:00+01:00')).days, '0002')
})

test('clamps every unit to zero on and after the target', () => {
  for (const now of ['2027-06-18T22:00:00Z', '2028-01-01T12:00:00Z']) {
    assert.deepEqual(getCountdown(targetAt, new Date(now)), {
      days: '0000', hours: '00', minutes: '00', seconds: '00', expired: true,
    })
  }
})

test('rejects invalid dates, normalized times and ambiguous zone-less timestamps', () => {
  for (const date of [
    '2027-02-30T00:00:00+01:00', '2027-06-19T24:00:00+02:00',
    '2027-06-19T00:00:60Z', '2027-06-19T00:00:00+24:00',
    '2027-06-19', '2027-06-19T00:00:00', '19/06/2027', 'not-a-date',
  ]) {
    assert.throws(() => getCountdown(date), { name: 'RangeError' })
  }
  assert.throws(() => getCountdown(targetAt, new Date('invalid')), { name: 'RangeError' })
})

test('supports 9999 days but rejects a fifth digit', () => {
  const now = new Date('2027-01-01T00:00:00Z')
  const target = new Date(now.getTime() + (10_000 * 86_400 - 1) * 1000)
  assert.deepEqual(getCountdown(target.toISOString(), now), {
    days: '9999', hours: '23', minutes: '59', seconds: '59', expired: false,
  })
  target.setUTCSeconds(target.getUTCSeconds() + 1)
  assert.throws(() => getCountdown(target.toISOString(), now), { name: 'RangeError' })
})

function renderCountdown(now) {
  const component = { ...FlipCountdown, data: () => ({ now: new Date(now), timer: undefined }) }
  return renderToString(createSSRApp(component, { targetAt, eventName: 'NM 2027' }))
}

test('renders four large cards and three pairs of compact cards with one quiet accessible timer', async () => {
  const html = await renderCountdown('2027-06-17T20:58:59Z')
  assert.equal((html.match(/data-digit=/g) ?? []).length, 10)
  assert.equal((html.match(/class="flip-digit compact"/g) ?? []).length, 6)
  for (const unit of ['hours', 'minutes', 'seconds']) {
    assert.ok(html.includes(`data-unit="${unit}"`))
  }
  assert.match(html, /aria-label="1 dag, 1 time, 1 minutt, 1 sekund igjen til NM 2027"/)
  assert.equal((html.match(/role="timer"/g) ?? []).length, 1)
  assert.match(html, /aria-live="off"/)
})

test('does not announce expiry while hours remain on the last day', async () => {
  const html = await renderCountdown('2027-06-18T00:00:00Z')
  assert.match(html, /0 dager, 22 timer/)
  assert.match(html, /Dager igjen/)
  assert.doesNotMatch(html, /Nedtellingen er over/)
})

test('announces expiry only when all units are zero', async () => {
  const html = await renderCountdown('2027-06-18T22:00:00Z')
  assert.match(html, /Nedtellingen til NM 2027 er over/)
  assert.match(html, /Nedtellingen er over/)
  assert.equal((html.match(/data-digit="0"/g) ?? []).length, 10)
})
