<template>
  <div class="flex">
    <KK67Logo
      class="grow-0 my-auto ml-8 mt-6"
      :img-width="70"
      :black-logo="false"
      :white-logo="true"
    />
    <div class="grow flex justify-end mr-8 mt-8">
      <NavbarButton
        class="my-auto mx-2"
        v-for="button in buttons"
        :key="button.title"
        :title="button.title"
        :focus="button.focus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import KK67Logo from './KK67Logo.vue'
import { defineComponent } from 'vue'
import NavbarButton, { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  data() {
    return {
      buttons: [
        {
          title: 'OM OSS',
          url: '/about',
        },
        {
          title: 'TIMEPLAN',
          url: '/timetable',
        },
        {
          title: 'REKORDER',
          url: '/records',
        },
        {
          title: 'BILDER',
          url: '/pictures',
        },
        {
          title: 'STEVNER',
          url: '/meets',
        },
        {
          title: 'SPONSOR',
          url: '/sponsor',
        },
        {
          title: 'BLI MEDLEM',
          url: '/join',
          focus: true,
        },
      ] as INavbarButton[],
    }
  },
  components: { NavbarButton, KK67Logo },
})
</script>

<style scoped></style>
