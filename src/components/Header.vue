<template>
  <div
    class="w-full mb-12"
    :class="showBackground() ? 'h-40' : 'h-10'"
    :style="`${updateHeaderBody()}`"
  >
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full"
      style="background-image: url(../../assets/logo/header.jpeg)"
      v-if="showBackground()"
    >
      <Navbar class="h-24" />
    </div>
    <div v-else>
      <Navbar class="h-24" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './Navbar/index.vue'
export default defineComponent({
  methods: {
    updateHeaderBody(): string {
      return this.showBackground() ? 'background-color: black; height: 35rem ' : 'height: 12.5rem'
    },

    showBackground(): boolean {
      return this.$route.name === 'Home'
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
