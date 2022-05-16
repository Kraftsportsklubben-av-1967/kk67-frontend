<template>
  <div class="font-bold p-2 lg:p-3 text-lg">
    <router-link
      v-if="invert"
      class="router-link"
      :class="
        focus
          ? 'bg-white text-black hover:bg-red-600 hover:text-slate-50'
          : 'bg-transparent text-white hover:bg-white hover:text-black'
      "
      :to="path"
    >
      <strong>{{ title }}</strong>
    </router-link>
    <router-link
      v-else
      class="router-link"
      :class="
        focus
          ? 'bg-black text-white hover:bg-red-600 hover:text-white'
          : 'text-black bg-transparent hover:bg-black hover:text-white'
      "
      :to="path"
      ><strong>{{ title }}</strong>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface INavbarButton {
  title: string
  path: string
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
    path: {
      type: String,
      required: true,
    },
    overrideInvert: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    invert(): boolean {
      if (this.overrideInvert) {
        return true
      }
      if (this.$route.name === 'Home') {
        return true
      }
      return false
    },
  },
})
</script>
<style scoped>
.router-link {
  transition-duration: 0.4s;
  @apply border-8 rounded-md border-transparent;
}
</style>
