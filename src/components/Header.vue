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
  position: relative;
  /* Keep the responsive height independent of the photo's crop. */
  padding-top: 7rem;
  padding-bottom: 30%;
}

.background-image::before {
  content: '';
  position: absolute;
  inset: 0 2rem;
  background-image: url(/public/logo/header.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

@media (min-width: 1231px) {
  .background-image {
    padding-top: 6rem;
  }
}

@media (min-width: 1280px) {
  .background-image {
    padding-bottom: 26%;
  }
}

@media (min-width: 1536px) {
  .background-image {
    padding-bottom: 21.5%;
  }
}

</style>
