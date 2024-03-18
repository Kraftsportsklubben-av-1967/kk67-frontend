<template>
  <header class="pt-6 w-full" :style="home ? 'background-color: black' : 'background-color:white'">
    <div :class="{ 'background-image': home }" class="main-container">
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
    Navbar,
  },
})
</script>

<style>
/*  Due to background images not being able to give % height to component we need to do this hackery.. */

.background-image {
  background-image: url(/public/logo/header.jpg);
  background-repeat: no-repeat;
  background-size: 110% auto;
  background-position: center top;
  padding-bottom: 30%;
}

@media (min-width: 768px) {
  .background-image {
    background-size: 100% auto;
  }
}

@media (min-width: 1280px) {
  .background-image {
    background-position: center 32.5%;
    background-size: 83% auto;
    padding-bottom: 26%;
  }
}
</style>
