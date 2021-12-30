<template>
  <div class="w-full" :style="`${updateHeaderBody()} height: 35rem;`">
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full"
      style="background-image: url(../../assets/header.jpeg)"
      v-if="showBackground"
    >
      <Navbar class="h-24" :navbarColor="navbarType" />
    </div>
    <div v-else>
      <Navbar class="h-24" :navbarColor="navbarType" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar, { NavbarType } from './Navbar.vue'
export default defineComponent({
  props: {
    showBackground: {
      type: Boolean,
      required: true,
    },
    navbarType: {
      NavbarType,
      required: true,
    },
  },
  data() {
    return {
      NavbarType,
    }
  },
  methods: {
    updateHeaderBody(): string {
      return this.navbarType ? '' : 'background-color: black;'
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
