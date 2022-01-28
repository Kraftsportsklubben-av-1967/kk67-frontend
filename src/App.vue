<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <router-view class="flex-1 mb-20" />
    <Footer />
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
