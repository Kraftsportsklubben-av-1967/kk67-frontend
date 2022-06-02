<template>
  <header
    :class="{ 'background-image': home }"
    class="pt-6 w-full"
    :style="home ? 'background-color: black' : 'background-color:white'"
  >
    <Navbar :class="{ 'h-40': !home }" />
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
/*  Due to background images not being able to give % height to component we need to do this hackery.. */

.background-image {
  background-image: url(/public/logo/header.jpeg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center top;
  padding-bottom: 32.5%;
}

@media (min-width: 768px) {
  .background-image {
    background-size: 90% auto;
    padding-bottom: 30%;
  }
}

@media (min-width: 832px) {
  .background-image {
    background-size: 82.5% auto;
    padding-bottom: 28%;
  }
}

@media (min-width: 896px) {
  .background-image {
    background-size: 75% auto;
    padding-bottom: 27.5%;
  }
}

@media (min-width: 1024px) {
  .background-image {
    background-size: 70% auto;
    padding-bottom: 25%;
  }
}

@media (min-width: 1280px) {
  .background-image {
    background-size: 60% auto;
    padding-bottom: 25%;
  }
}
</style>
