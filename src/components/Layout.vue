<template>
  <div
    class="flex flex-col h-full lg:flex-row lg:justify-between mx-8 sm:mx-auto md:w-5/6 sm:w-5/6 flex-1"
  >
    <aside class="lg:w-2/6 w-full">
      <slot name="sidebar"></slot>
    </aside>
    <main class="lg:w-7/12 xl:pl-16 w-full lg:mt-0 mt-6 xl:ml-40">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Layout',
})
</script>
