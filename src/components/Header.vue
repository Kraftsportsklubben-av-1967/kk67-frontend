<template>
  <header class="w-full pt-6" :style="`${updateHeaderBody()}`">
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full"
      style="background-image: url(/public/logo/header.jpeg)"
      v-if="$route.name === 'Home'"
    >
      <Navbar />
    </div>
    <div v-else class="mx-auto">
      <Navbar />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './Navbar/index.vue'
export default defineComponent({
  methods: {
    updateHeaderBody(): string {
      return this.$route.name === 'Home'
        ? 'background-color: black; height: 35rem '
        : 'height: 10rem;'
    },
  },
  components: {
    Navbar: Navbar,
  },
})
</script>

<style scoped>
#header-background-image {
  background-position: 50% 2.5%;
}
</style>
