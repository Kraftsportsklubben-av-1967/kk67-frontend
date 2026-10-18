<template>
  <div class="flex justify-between items-center gap-4">
    <KK67Logo class="shrink-0" />
    <div class="flex flex-nowrap items-center justify-end gap-1">
      <NavbarButton
        class="shrink-0 whitespace-nowrap"
        v-for="button in navbarButtons"
        :key="button.title"
        :title="button.title"
        :focus="button.focus"
        :path="button.path"
        compact
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
