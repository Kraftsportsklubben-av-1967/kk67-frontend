<template>
  <div class="flex-grow flex lg:flex-row flex-col lg:justify-between layout-container">
    <div class="lg:w-2/6 w-full"><slot name="sidebar"></slot></div>
    <div class="lg:w-4/6 lg:pl-6 w-full lg:mt-0 mt-6"><slot name="main"></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Content',
})
</script>

<style scoped>
.layout-container {
  padding: 0rem;
  @apply mx-auto;
}

@media (min-width: 1024px) {
  .layout-container {
    padding: 2.5rem 7rem 0rem;
    @apply mx-0;
  }
}
</style>
