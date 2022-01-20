<template>
  <nav v-if="showDekstop" aria-label="desktop-nav">
    <Navbar-desktop :logo-color="selectLogo()" />
  </nav>
  <nav v-else aria-label="mobile-nav">
    <Navbar-mobile :logo-color="selectLogo()" />
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'
import { LOGO_TYPES } from '@components/KK67Logo.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    'Navbar-desktop': NavbarDesktop,
    'Navbar-mobile': NavbarMobile,
  },
  data() {
    return {
      showDekstop: true,
    }
  },
  created() {
    window.addEventListener('resize', () => {
      this.showDekstop = window.outerWidth > 1096
    })
  },
  methods: {
    selectLogo() {
      if (this.$route.name === 'Home') {
        return LOGO_TYPES.WHITE_LGOO
      }
      return LOGO_TYPES.DEFAULT_LOGO
    },
  },
})
</script>
