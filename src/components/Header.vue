<template>
  <div class="w-full" style="background-color: black; height: 35rem">
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full"
      style="background-image: url(../../assets/header.jpeg)"
      v-if="showBackground"
    >
      <navbar class="h-24" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './Navbar.vue'
export default defineComponent({
  props: {
    showBackground: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    navbar: Navbar,
  },
})
</script>

<style scoped>
#header-background-image {
  background-position: 50% 2.5%;
}
</style>
