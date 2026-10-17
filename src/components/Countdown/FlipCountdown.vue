<template>
  <div class="day-countdown" role="timer" :aria-label="accessibleLabel" aria-live="off">
    <div class="digits" aria-hidden="true">
      <FlipDigit v-for="(digit, index) in digits" :key="index" :value="digit" />
    </div>
    <p class="countdown-unit" aria-hidden="true">
      {{ digits === '0000' ? 'Nedtellingen er over' : 'Dager igjen' }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getDayCountdown } from '../../utils/getDayCountdown'
import FlipDigit from './FlipDigit.vue'

interface CountdownState {
  now: Date
  timer: number | undefined
}

export default defineComponent({
  components: { FlipDigit },
  props: {
    targetDate: { type: String, required: true },
    eventName: { type: String, required: true },
  },
  data(): CountdownState {
    return { now: new Date(), timer: undefined }
  },
  computed: {
    digits(): string {
      return getDayCountdown(this.targetDate, this.now)
    },
    accessibleLabel(): string {
      const days = Number(this.digits)
      return days === 0
        ? `Nedtellingen til ${this.eventName} er over`
        : `${days} ${days === 1 ? 'dag' : 'dager'} igjen til ${this.eventName}`
    },
  },
  mounted() {
    this.timer = window.setInterval(() => { this.now = new Date() }, 1000)
  },
  beforeUnmount() {
    window.clearInterval(this.timer)
  },
})
</script>

<style scoped>
.digits {
  display: flex;
  justify-content: center;
  gap: clamp(.35rem, 1vw, .9rem);
}
.countdown-unit {
  margin-top: 1.75rem;
  text-align: center;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .3em;
  text-transform: uppercase;
}
</style>
