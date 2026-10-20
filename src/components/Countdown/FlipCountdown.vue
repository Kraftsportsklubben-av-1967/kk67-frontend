<template>
  <div class="day-countdown" role="timer" :aria-label="accessibleLabel" aria-live="off">
    <div class="digits" aria-hidden="true">
      <FlipDigit v-for="(digit, index) in remaining.days" :key="index" :value="digit" />
    </div>
    <p class="countdown-unit" aria-hidden="true">
      {{ remaining.expired ? 'Nedtellingen er over' : 'Dager igjen' }}
    </p>
    <div class="clock" aria-hidden="true">
      <div v-for="unit in timeUnits" :key="unit.name" :data-unit="unit.name">
        <div class="digits time-digits">
          <FlipDigit v-for="(digit, index) in unit.digits" :key="index" :value="digit" compact />
        </div>
        <p class="clock-unit">{{ unit.label }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getCountdown, type Countdown } from '../../utils/getCountdown'
import FlipDigit from './FlipDigit.vue'

interface CountdownState {
  now: Date
  timer: number | undefined
}

export default defineComponent({
  components: { FlipDigit },
  props: {
    targetAt: { type: String, required: true },
    eventName: { type: String, required: true },
  },
  data(): CountdownState {
    return { now: new Date(), timer: undefined }
  },
  computed: {
    remaining(): Countdown {
      return getCountdown(this.targetAt, this.now)
    },
    timeUnits() {
      return [
        { name: 'hours', label: 'Timer', digits: this.remaining.hours },
        { name: 'minutes', label: 'Minutter', digits: this.remaining.minutes },
        { name: 'seconds', label: 'Sekunder', digits: this.remaining.seconds },
      ]
    },
    accessibleLabel(): string {
      if (this.remaining.expired) {
        return `Nedtellingen til ${this.eventName} er over`
      }
      const { days, hours, minutes, seconds } = this.remaining
      const units = [
        `${Number(days)} ${days === '0001' ? 'dag' : 'dager'}`,
        `${Number(hours)} ${hours === '01' ? 'time' : 'timer'}`,
        `${Number(minutes)} ${minutes === '01' ? 'minutt' : 'minutter'}`,
        `${Number(seconds)} ${seconds === '01' ? 'sekund' : 'sekunder'}`,
      ]
      return `${units.join(', ')} igjen til ${this.eventName}`
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
.clock {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
  margin-top: 1.75rem;
}
.time-digits { gap: clamp(.2rem, .6vw, .4rem); }
.clock-unit {
  margin-top: .8rem;
  color: #c6c4bd;
  text-align: center;
  font-size: clamp(.6rem, 1.2vw, .7rem);
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}
</style>
