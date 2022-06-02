<template>
  <div class="flex justify-between">
    <KK67Logo />
    <div class="flex justify-end my-auto">
      <NavbarButton
        class="my-auto mx-2 text-sm"
        v-for="button in navbarButtons"
        :key="button.title"
        :title="button.title"
        :focus="button.focus"
        :path="button.path"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import KK67Logo from '../Media/KK67Logo.vue'
import NavbarButton, { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  name: 'NavbarDesktop',
  inheritAttrs: false,
  props: {
    navbarButtons: {
      type: Array as PropType<Array<INavbarButton>>,
      required: true,
    },
  },
  components: { NavbarButton, KK67Logo },
})
</script>
