<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="pt-6 md:pt-12 pb-12">
      <div class="main-container">
        <router-view />
      </div>
    </main>
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
<style>
.main-container {
  @apply 2xl:w-10/12 2xl:m-auto;
}
</style>
