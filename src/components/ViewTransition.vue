<template>
  <Transition :name="subpage ? 'subpage-view' : 'page-view'" @leave="leaveImmediately">
    <div :key="viewKey" class="view-content" :class="{ 'view-content--subpage': subpage }">
      <slot />
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ViewTransition',
  props: {
    viewKey: { type: String, required: true },
    subpage: Boolean,
  },
  methods: {
    // Keep only the incoming view mounted; navigation never waits for an exit animation.
    leaveImmediately(_element: Element, done: () => void) {
      done()
    },
  },
})
</script>

<style scoped>
.view-content {
  min-width: 0;
}

.page-view-enter-active,
.subpage-view-enter-active {
  transition:
    opacity 240ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.subpage-view-enter-active {
  transition-duration: 180ms;
}

.page-view-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.subpage-view-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-view-enter-active,
  .subpage-view-enter-active {
    transition: none;
  }

  .page-view-enter-from,
  .subpage-view-enter-from {
    opacity: 1;
    transform: none;
  }
}
</style>
