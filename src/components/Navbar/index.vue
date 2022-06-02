<template>
  <nav class="h-fit mx-8">
    <NavbarDesktop v-if="showDekstop" :navbar-buttons="buttons" />
    <NavbarMobile v-else :navbar-buttons="buttons" />
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarDesktop,
    NavbarMobile,
  },
  data() {
    return {
      showDekstop: true,
      buttons: [
        {
          title: 'OM OSS',
          path: '/about',
        },
        {
          title: 'TIMEPLAN',
          path: '/schedule',
        },
        {
          title: 'REKORDER',
          path: '/records',
        },
        {
          title: 'BILDER',
          path: '/pictures',
        },
        {
          title: 'STEVNER',
          path: '/meets',
        },
        {
          title: 'OFTE STILTE SPØRSMÅL',
          path: '/faq/1',
        },
        {
          title: 'BLI MEDLEM',
          path: '/join',
          focus: true,
        },
      ],
    }
  },
  created() {
    this.showDekstop = window.outerWidth > 1130
    window.addEventListener('resize', () => {
      this.showDekstop = window.outerWidth > 1130
    })
  },
})
</script>
