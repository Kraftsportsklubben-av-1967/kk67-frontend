<template>
  <div>
    <router-link :to="path" class="hover:text-gray-500">
      <p class="font-medium text-md pb-4">
        <span v-if="focus" class="text-red-600 pr-2">&#11044;</span>
        {{ title }}
      </p>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface IMenuButton {
  title: string
  path: string
  focus: boolean
}

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    focus: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
