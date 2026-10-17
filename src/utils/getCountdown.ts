export interface Countdown {
  days: string
  hours: string
  minutes: string
  seconds: string
  expired: boolean
}

export function getCountdown(targetAt: string, now = new Date()): Countdown {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(targetAt)) {
    throw new RangeError('Expected an ISO countdown timestamp with seconds and a UTC offset')
  }
  const target = new Date(targetAt)
  // Date.parse can normalize impossible calendar dates and 24:00 into the next day.
  const wallClock = new Date(`${targetAt.slice(0, 19)}Z`)
  if (!Number.isFinite(target.getTime()) || !Number.isFinite(wallClock.getTime())
    || wallClock.toISOString().slice(0, 19) !== targetAt.slice(0, 19)) {
    throw new RangeError('Expected a valid countdown date and time')
  }
  if (!Number.isFinite(now.getTime())) {
    throw new RangeError('Expected a valid current date')
  }

  const remaining = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 1000))
  const days = Math.floor(remaining / 86_400)
  if (days > 9999) {
    throw new RangeError('The four-digit countdown supports at most 9999 days')
  }
  return {
    days: String(days).padStart(4, '0'),
    hours: String(Math.floor(remaining / 3600) % 24).padStart(2, '0'),
    minutes: String(Math.floor(remaining / 60) % 60).padStart(2, '0'),
    seconds: String(remaining % 60).padStart(2, '0'),
    expired: remaining === 0,
  }
}
