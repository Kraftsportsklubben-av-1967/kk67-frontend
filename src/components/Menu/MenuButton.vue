<template>
  <div class="router-link duration-500 ease-in-out">
    <router-link :to="path" @mouseenter="hover = true" @mouseleave="hover = false">
      <p class="font-medium text-md pb-4">
        <Transition>
          <span v-if="focus || hover" class="text-red-600 pr-2">&#11044;</span>
        </Transition>
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
  data() {
    return {
      hover: false,
    }
  },
})
</script>
<style scoped lang="scss">
.router-link:hover {
  @apply text-gray-500;

  span {
    @apply text-red-500;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
