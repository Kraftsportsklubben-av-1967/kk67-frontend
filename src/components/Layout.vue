<template>
  <div class="flex flex-col h-full lg:flex-row lg:justify-between md:w-5/6 md:mx-auto flex-1">
    <aside class="lg:w-2/6 mx-8 md:mx-0">
      <slot name="sidebar"></slot>
    </aside>
    <div class="xl:w-5/12 lg:w-6/12 lg:mt-0 mt-6 xl:ml-40 md:mx-0" :class="fullMain ? 'mx-0' : 'mx-8'">
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
