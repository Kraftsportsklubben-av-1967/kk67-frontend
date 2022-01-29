<template>
  <article class="border rounded-xl shadow-lg p-8 inline-block">
    <div v-if="hasHeader" class="text-xl font-bold">
      <slot name="header"></slot>
    </div>
    <div class="text-md text-left mt-2">
      <slot name="body"></slot>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Card',
  computed: {
    hasHeader(): boolean {
      return !!this.$slots.header
    },
  },
})
</script>

<style scoped></style>
