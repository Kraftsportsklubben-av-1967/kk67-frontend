<template>
  <header class="w-full pt-6" :class="`${home ? 'black-header' : 'header'}`">
    <div
      id="header-background-image"
      class="bg-center bg-no-repeat h-full md:bg-auto bg-cover"
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
  computed: {
    home() {
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

.black-header {
  background-color: black;
  height: 17.5rem;
}

@media (min-width: 768px) {
  .black-header {
    height: 35rem;
  }
}

@media (min-width: 640px) {
  .black-header {
    height: 30rem;
  }
}

.header {
  height: 10rem;
}
</style>
