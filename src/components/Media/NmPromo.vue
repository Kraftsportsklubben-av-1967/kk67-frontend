<template>
  <router-link to="/nm" class="nm-promo" :aria-label="`${event.name}: ${daysLabel}. Les mer`">
    <p class="eyebrow">KK-67 fyller 60 år</p>
    <img
      class="logo"
      src="/public/logo/nm-2027-logo.png"
      alt=""
      width="2236"
      height="2752"
      decoding="async"
    />
    <p class="title">NM <span>2027</span></p>
    <p v-if="!expired" class="days">
      <strong>{{ days }}</strong>
      <span>{{ days === 1 ? 'dag' : 'dager' }} igjen</span>
    </p>
    <p class="meta">{{ eventDates }}<br />{{ event.city }}</p>
    <span class="cta">Les mer om NM <span aria-hidden="true">↗</span></span>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NM_EVENT } from '../../constants/nm'
import { getCountdown } from '../../utils/getCountdown'

export default defineComponent({
  name: 'NmPromo',
  data() {
    return { event: NM_EVENT }
  },
  computed: {
    countdown() {
      return getCountdown(this.event.countdownAt)
    },
    expired(): boolean {
      return this.countdown.expired
    },
    days(): number {
      return Number(this.countdown.days)
    },
    daysLabel(): string {
      return this.expired ? 'Mesterskapet er i gang' : `${this.days} dager igjen`
    },
    eventDates(): string {
      return new Intl.DateTimeFormat('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Oslo',
      }).formatRange(
        new Date(`${this.event.startsOn}T00:00:00Z`),
        new Date(`${this.event.endsOn}T00:00:00Z`),
      )
    },
  },
})
</script>

<style scoped>
.nm-promo {
  display: block;
  padding: 1.5rem 1.25rem;
  border-top: 6px solid #b91c1c;
  background: #131419;
  color: #f4f0e7;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.nm-promo:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px #0000004d;
}
.nm-promo:focus-visible {
  outline: 2px solid #b91c1c;
  outline-offset: 3px;
}
.eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c6c4bd;
}
.logo {
  display: block;
  width: 6rem;
  height: auto;
  margin: 1.25rem auto 0;
}
.title {
  margin-top: 1rem;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
  white-space: nowrap;
}
.title span {
  color: #f15d55;
}
.days {
  margin-top: 1.25rem;
  padding: 0.9rem 0;
  border-block: 1px solid #ffffff26;
}
.days strong {
  display: block;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.days span {
  display: block;
  margin-top: 0.4rem;
  color: #c6c4bd;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.meta {
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.5;
}
.cta {
  display: block;
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  background: #b91c1c;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background 0.2s ease;
}
.nm-promo:hover .cta {
  background: #d12a2a;
}
@media (min-width: 640px) and (max-width: 1023px) {
  .title {
    font-size: 2.75rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .nm-promo,
  .cta {
    transition: none;
  }
  .nm-promo:hover {
    transform: none;
  }
}
</style>
