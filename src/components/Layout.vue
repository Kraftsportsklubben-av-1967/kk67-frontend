<template>
  <div class="flex-grow flex flex-row justify-between px-10 pt-10">
    <div class="w-2/5 pl-14"><slot name="sidebar"></slot></div>
    <div class="w-3/5 pl-14"><slot name="main"></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Content',
})
</script>

<style scoped></style>
