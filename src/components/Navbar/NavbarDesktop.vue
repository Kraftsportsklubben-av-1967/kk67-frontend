<template>
  <div class="flex mx-10 justify-between">
    <KK67Logo class="my-auto mt-6 ml-2" :logo-color="logoColor" />
    <div class="flex justify-end mt-8">
      <NavbarButton
        class="my-auto mx-2 text-sm"
        v-for="button in buttons"
        :key="button.title"
        :title="button.title"
        :focus="button.focus"
        :path="button.path"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KK67Logo, { LOGO_TYPES } from '../KK67Logo.vue'
import NavbarButton, { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  name: 'NavbarDesktop',
  props: {
    logoColor: {
      default: LOGO_TYPES.DEFAULT_LOGO,
    },
  },
  data() {
    return {
      buttons: [
        {
          title: 'OM OSS',
          path: '/about',
        },
        {
          title: 'TIMEPLAN',
          path: '/timetable',
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
          title: 'SPONSOR',
          path: '/sponsor',
        },
        {
          title: 'BLI MEDLEM',
          path: '/join',
          focus: true,
        },
      ] as INavbarButton[],
    }
  },
  methods: {
    selectLogo() {
      if (this.$route.name === 'Home') {
        return LOGO_TYPES.WHITE_LGOO
      }
      return LOGO_TYPES.DEFAULT_LOGO
    },
  },
  components: { NavbarButton, KK67Logo },
})
</script>
