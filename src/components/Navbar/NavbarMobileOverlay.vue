<template>
  <div
    class="h-full fixed z-10 left-0 w-full top-0 overflow-x-hidden duration-500 px-6 pb-8 pt-6"
    style="background-color: rgba(0, 0, 0, 0.75)"
  >
    <div class="w-full flex flex-col">
      <div class="flex flex-row-reverse">
        <p
          class="w-fit h-fit text-white cursor-pointer hover:text-slate-700 duration-500 pr-2"
          style="font-size: 60px; margin-top: -0.5rem"
        >
          &times;
        </p>
      </div>
      <div>
        <NavbarButton
          v-for="button in navbarButtons"
          class="text-xl mt-4 opacity-100"
          :key="button.title"
          :path="button.path"
          :title="button.title"
          :focus="button.focus"
          :override-invert="true"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import NavbarButton, { INavbarButton } from '@components/Navbar/NavbarButton.vue'

export default defineComponent({
  name: 'NavbarMobileOverlay',
  props: {
    navbarButtons: {
      type: [] as PropType<INavbarButton[]>,
      required: true,
    },
  },
  components: { NavbarButton },
})
</script>
