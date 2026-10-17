import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})
after(() => server.close())
const { getDayCountdown } = await server.ssrLoadModule('/src/utils/getDayCountdown.ts')

test('always displays four day digits, including leading zeroes', () => {
  assert.equal(getDayCountdown('2027-06-19', new Date('2027-06-10T12:00:00Z')), '0009')
  assert.equal(getDayCountdown('2027-06-19', new Date('2027-06-18T12:00:00Z')), '0001')
})

test('rolls over at Norwegian summer midnight, not UTC midnight', () => {
  assert.equal(getDayCountdown('2027-06-19', new Date('2027-06-18T21:59:59Z')), '0001')
  assert.equal(getDayCountdown('2027-06-19', new Date('2027-06-18T22:00:00Z')), '0000')
})

test('rolls over at Norwegian winter midnight', () => {
  assert.equal(getDayCountdown('2027-01-03', new Date('2027-01-01T22:59:59Z')), '0002')
  assert.equal(getDayCountdown('2027-01-03', new Date('2027-01-01T23:00:00Z')), '0001')
})

test('counts calendar days across the 25-hour daylight-saving transition', () => {
  assert.equal(getDayCountdown('2026-10-26', new Date('2026-10-24T22:30:00Z')), '0001')
})

test('includes leap days', () => {
  assert.equal(getDayCountdown('2028-03-01', new Date('2028-02-28T12:00:00Z')), '0002')
})

test('does not count backwards on or after the event', () => {
  assert.equal(getDayCountdown('2027-06-19', new Date('2027-06-19T12:00:00Z')), '0000')
  assert.equal(getDayCountdown('2027-06-19', new Date('2028-01-01T12:00:00Z')), '0000')
})

test('rejects invalid dates instead of displaying a misleading countdown', () => {
  for (const date of ['2027-02-30', '19/06/2027', 'not-a-date']) {
    assert.throws(() => getDayCountdown(date), { name: 'RangeError' })
  }
  assert.throws(() => getDayCountdown('2027-06-19', new Date('invalid')), { name: 'RangeError' })
})

test('supports 9999 days but rejects a fifth digit', () => {
  const now = new Date('2027-01-01T12:00:00Z')
  const target = new Date('2027-01-01T00:00:00Z')
  target.setUTCDate(target.getUTCDate() + 9999)
  assert.equal(getDayCountdown(target.toISOString().slice(0, 10), now), '9999')
  target.setUTCDate(target.getUTCDate() + 1)
  assert.throws(() => getDayCountdown(target.toISOString().slice(0, 10), now), { name: 'RangeError' })
})
