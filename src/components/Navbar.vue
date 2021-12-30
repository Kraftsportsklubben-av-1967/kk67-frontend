<template>
  <div class="flex">
    <KK67Logo
      class="grow-0 my-auto ml-8 mt-6"
      :img-width="70"
      :logo-color="LOGO_TYPES.WHITE_LGOO"
    />
    <div class="grow flex justify-end mr-8 mt-8">
      <NavbarButton
        class="my-auto mx-2"
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
import KK67Logo, { LOGO_TYPES } from './KK67Logo.vue'
import { defineComponent } from 'vue'
import NavbarButton, { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  name: 'Navbar',
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
      LOGO_TYPES: LOGO_TYPES,
    }
  },
  components: { NavbarButton, KK67Logo },
})
</script>

<style scoped></style>
