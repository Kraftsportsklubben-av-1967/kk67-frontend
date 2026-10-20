<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="pt-6 md:pt-12 pb-12">
      <div class="main-container px-8">
        <ViewTransition :view-key="pageKey">
          <router-view />
        </ViewTransition>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import Footer from './components/Footer/index.vue'
import Header from './components/Header.vue'
import ViewTransition from './components/ViewTransition.vue'
import { defineComponent } from 'vue'
import NavbarMobileOverlay from '@components/Navbar/NavbarMobileOverlay.vue'
export default defineComponent({
  computed: {
    pageKey(): string {
      return this.$route.path.split('/')[1]
    },
  },
  components: {
    Footer,
    Header,
    NavbarMobileOverlay,
    ViewTransition,
  },
})
</script>
<style>
.main-container {
  @apply xl:w-10/12 xl:m-auto 2xl:w-3/4 2xl:m-auto;
}
</style>
