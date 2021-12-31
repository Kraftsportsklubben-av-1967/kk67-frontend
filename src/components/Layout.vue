<template>
  <div class="flex-grow flex flex-row justify-between" style="padding: 2.5rem 7rem 0rem">
    <div class="w-2/6"><slot name="sidebar"></slot></div>
    <div class="w-4/6 pl-6"><slot name="main"></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Content',
})
</script>

<style scoped></style>
