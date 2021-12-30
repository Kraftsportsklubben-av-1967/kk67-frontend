<template>
  <Header class="h-40" :showBackground="showBackground()" :navbarType="selectNavBar()" />
  <router-view />
  <Footer />
</template>

<script lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { defineComponent } from 'vue'
import { NavbarType } from './components/Navbar.vue'

export default defineComponent({
  methods: {
    selectNavBar(): NavbarType {
      if (this.$route.name === 'Home') {
        return NavbarType.HOMEPAGE
      }
      return NavbarType.DEFAULT
    },
    showBackground(): boolean {
      switch (this.selectNavBar()) {
        case NavbarType.HOMEPAGE:
          return true
        case NavbarType.DEFAULT:
          return false
      }
    },
  },
  components: {
    Footer,
    Header,
  },
})
</script>

<style>
#app {
  text-align: center;
}
</style>
