<template>
  <div class="flex flex-col min-h-screen">
    <Header class="mb-12" />
    <router-view class="flex-1" />
    <Footer class="mt-12" />
  </div>
</template>

<script lang="ts">
import Footer from './components/Footer/index.vue'
import Header from './components/Header.vue'
import { defineComponent } from 'vue'
import NavbarMobileOverlay from '@components/Navbar/NavbarMobileOverlay.vue'
export default defineComponent({
  components: {
    Footer,
    Header,
    NavbarMobileOverlay,
  },
})
</script>
