const DAY_IN_MS = 86_400_000
const norwegianDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Oslo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function getDayCountdown(targetDate: string, now = new Date()): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    throw new RangeError('Expected the countdown date in YYYY-MM-DD format')
  }
  const target = new Date(`${targetDate}T00:00:00Z`)
  if (!Number.isFinite(target.getTime()) || target.toISOString().slice(0, 10) !== targetDate) {
    throw new RangeError('Expected a valid calendar date')
  }
  if (!Number.isFinite(now.getTime())) {
    throw new RangeError('Expected a valid current date')
  }

  // Compare calendar dates, not 24-hour durations: Norwegian days can be 23 or 25 hours.
  const parts = norwegianDate.formatToParts(now)
  const [year, month, day] = ['year', 'month', 'day'].map(type => {
    const part = parts.find(part => part.type === type)
    if (!part) {
      throw new RangeError(`Missing Norwegian calendar date part: ${type}`)
    }
    return Number(part.value)
  })
  const today = new Date(0)
  today.setUTCFullYear(year, month - 1, day)
  const days = Math.max(0, Math.round((target.getTime() - today.getTime()) / DAY_IN_MS))
  if (!Number.isInteger(days) || days > 9999) {
    throw new RangeError('The four-digit countdown supports at most 9999 days')
  }
  return String(days).padStart(4, '0')
}
