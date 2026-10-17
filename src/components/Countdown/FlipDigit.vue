<template>
  <div class="flip-digit" :class="{ compact }" :data-digit="value" aria-hidden="true">
    <div class="face top"><span class="number">{{ value }}</span></div>
    <div class="face bottom"><span class="number">{{ value }}</span></div>
    <div v-if="flipping" :key="value" class="flip-overlay">
      <div class="face bottom old-bottom"><span class="number">{{ previous }}</span></div>
      <div class="face top flap-top"><span class="number">{{ previous }}</span></div>
      <div class="face bottom flap-bottom"><span class="number">{{ value }}</span></div>
    </div>
    <span class="seam"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface FlipState {
  previous: string
  flipping: boolean
  resetTimer: number | undefined
}

export default defineComponent({
  props: {
    value: { type: String, required: true },
    compact: { type: Boolean, default: false },
  },
  data(): FlipState {
    return { previous: this.value, flipping: false, resetTimer: undefined }
  },
  watch: {
    value(value: string, previous: string) {
      window.clearTimeout(this.resetTimer)
      this.previous = previous
      this.flipping = true
      this.resetTimer = window.setTimeout(() => { this.flipping = false }, 700)
    },
  },
  beforeUnmount() {
    window.clearTimeout(this.resetTimer)
  },
})
</script>

<style scoped>
.flip-digit {
  --digit-height: clamp(4.5rem, 18vw, 13rem);
  position: relative;
  width: clamp(3rem, 13vw, 9.5rem);
  height: var(--digit-height);
  border-radius: 6px;
  color: #171715;
  font-size: clamp(3.5rem, 13.5vw, 10rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  perspective: 800px;
  box-shadow: 0 5px 0 #aaa498, 0 10px 18px #0008;
}
.face {
  position: absolute;
  inset-inline: 0;
  height: 50%;
  overflow: hidden;
  backface-visibility: hidden;
}
.top { top: 0; border-radius: 6px 6px 0 0; background: #f4f0e7; }
.bottom { bottom: 0; border-radius: 0 0 6px 6px; background: #e5dfd3; }
.number {
  position: absolute;
  inset-inline: 0;
  display: grid;
  place-items: center;
  height: var(--digit-height);
  font: inherit;
  line-height: 1;
}
.top .number { top: 0; }
.bottom .number { bottom: 0; }
.old-bottom { z-index: 1; }
.flap-top {
  z-index: 2;
  transform-origin: bottom;
  animation: flip-top 320ms ease-in forwards;
}
.flap-bottom {
  z-index: 3;
  transform: rotateX(90deg);
  transform-origin: top;
  animation: flip-bottom 320ms 320ms ease-out forwards;
}
.seam {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #171715b3;
}
.seam::before, .seam::after {
  content: '';
  position: absolute;
  top: -4px;
  width: 3px;
  height: 10px;
  border-radius: 1px;
  background: #282824;
}
.seam::before { left: 5px; }
.seam::after { right: 5px; }
.compact {
  --digit-height: clamp(2.25rem, 7vw, 4.75rem);
  width: clamp(1.5rem, 5vw, 3.5rem);
  color: #ef4444;
  font-size: clamp(1.75rem, 5.5vw, 3.75rem);
  box-shadow: 0 3px 0 #000, 0 7px 12px #0008;
}
.compact .top { background: #151515; }
.compact .bottom { background: #080808; }
.compact .seam { height: 1px; background: #000b; }
.compact .seam::before, .compact .seam::after { top: -2px; width: 2px; height: 5px; }
.compact .seam::before { left: 3px; }
.compact .seam::after { right: 3px; }
@keyframes flip-top { to { transform: rotateX(-90deg); } }
@keyframes flip-bottom { to { transform: rotateX(0); } }
@media (prefers-reduced-motion: reduce) {
  .flip-overlay { display: none; }
}
</style>
