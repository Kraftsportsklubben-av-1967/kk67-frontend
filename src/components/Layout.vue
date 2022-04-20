<template>
  <div
    class="flex flex-col h-full lg:flex-row lg:justify-between mx-auto md:w-5/6 sm:w-3/4 xs:w-5/6"
  >
    <aside class="lg:w-2/6 w-full">
      <slot name="sidebar"></slot>
    </aside>
    <main class="lg:w-7/12 lg:pl-16 w-full lg:mt-0 mt-6 lg:ml-40">
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
