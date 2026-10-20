<template>
  <header class="pt-6 w-full" :style="home ? 'background-color: black' : 'background-color:white'">
    <div class="main-container px-8">
      <Navbar />
    </div>
    <div v-if="home" class="main-container background-image"></div>
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
    Navbar,
  },
})
</script>

<style>
.background-image {
  background-image: url(/public/logo/header.jpg);
  background-repeat: no-repeat;
  background-size: 110% auto;
  background-position: center top;
  /* Preserve the photo's framing after moving the navigation above it. */
  padding-top: 7rem;
  padding-bottom: 30%;
}

@media (min-width: 768px) {
  .background-image {
    background-size: 100% auto;
  }
}

@media (min-width: 1231px) {
  .background-image {
    padding-top: 6rem;
  }
}

@media (min-width: 1280px) {
  .background-image {
    background-position: center 32.5%;
    background-size: 83% auto;
    padding-bottom: 26%;
  }
}

@media (min-width: 1536px) {
  .background-image {
    background-size: 83% auto;
    background-position: center 37.5%;
    padding-bottom: 21.5%;
  }
}

</style>
