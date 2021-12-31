<template>
  <div class="w-full h-40 mb-12" :style="`${updateHeaderBody()} height: 35rem;`">
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full"
      style="background-image: url(../../assets/header.jpeg)"
      v-if="showBackground()"
    >
      <Navbar class="h-24" :navbarColor="NavbarType.HOMEPAGE" />
    </div>
    <div v-else>
      <Navbar class="h-24" :navbarColor="NavbarType.DEFAULT" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar, { NavbarType } from './Navbar.vue'
export default defineComponent({
  data() {
    return {
      NavbarType,
    }
  },
  methods: {
    updateHeaderBody(): string {
      return this.showBackground() ? 'background-color: black; ' : ''
    },

    showBackground(): boolean {
      return this.$route.name === 'Home'
    },
  },
  components: {
    Navbar,
  },
})
</script>

<style scoped>
#header-background-image {
  background-position: 50% 2.5%;
}
</style>
