<template>
  <div
    class="border-solid border-t-red-600 border-gray-200 rounded-full flex justify-center loader"
  />
</template>

<style scoped>
.loader {
  box-sizing: border-box;
  border-width: 7.5px;
  animation: spin 1.9s linear infinite;
  margin: auto;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Loader',
})
</script>
