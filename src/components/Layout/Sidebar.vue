<template>
  <div class="flex flex-col">
    <div></div>
    <div class="header-red-underline">
      <h1>{{ header }}</h1>
    </div>
    <div class="mt-8">
      <slot name="main"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  props: {
    header: {
      type: String,
      required: true,
    },
  },
})
</script>
