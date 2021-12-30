<template>
  <div class="text-sm font-bold p-4">
    <button
      v-if="focus"
      class="
        bg-white
        border-8
        rounded-md
        border-transparent
        text-black
        hover:bg-red-600 hover:text-slate-50
      "
    >
      <strong>{{ title }}</strong>
    </button>
    <button
      v-else
      class="
        border-8
        bg-transparent
        rounded-md
        border-transparent
        text-white
        hover:bg-white hover:text-black
      "
    >
      <strong>{{ title }}</strong>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface INavbarButton {
  title: string
  url: string
  focus?: boolean
}

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    focus: {
      type: Boolean,
    },
  },
})
</script>
<style scoped>
button {
  transition-duration: 0.4s;
}
</style>
