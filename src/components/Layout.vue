<template>
  <div class="flex flex-col h-full lg:flex-row lg:justify-between lg:gap-12 flex-1">
    <aside class="lg:w-1/5">
      <slot name="sidebar"></slot>
    </aside>
    <div class="xl:w-[55%] lg:w-[46%] lg:mt-0 mt-6" :class="{ '-mx-8 md:mx-0': fullMain }">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Layout',
  props: {
    fullMain: Boolean,
  },
})
</script>
