<template>
  <NavbarMobileOverlay v-if="toggled" @click="toggleOverlay" :navbar-buttons="navbarButtons" />
  <div class="flex justify-between">
    <KK67Logo :logo-color="logoColor" class="my-auto ml-8 mt-6" />
    <div class="mr-8 mt-8 cursor-pointer hover:opacity-70 duration-500" @click="toggleOverlay">
      <div v-if="!toggled">
        <div class="hamburger-line" :class="invert ? 'bg-black' : 'bg-white'"></div>
        <div class="hamburger-line" :class="invert ? 'bg-black' : 'bg-white'"></div>
        <div class="hamburger-line" :class="invert ? 'bg-black' : 'bg-white'"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import KK67Logo, { LOGO_TYPES } from '@components/KK67Logo.vue'
import NavbarMobileOverlay from '@components/Navbar/NavbarMobileOverlay.vue'
import { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  name: 'NavbarMobile',
  components: { KK67Logo, NavbarMobileOverlay },
  emits: ['showNavbarOverlay'],
  props: {
    logoColor: {
      default: LOGO_TYPES.DEFAULT_LOGO,
    },
    navbarButtons: {
      type: [] as PropType<INavbarButton[]>,
      required: true,
    },
  },
  data() {
    return {
      toggled: false,
    }
  },
  methods: {
    toggleOverlay(): void {
      this.toggled = !this.toggled
    },
  },
  computed: {
    invert(): boolean {
      return this.$route.name !== 'Home'
    },
  },
  unmounted() {
    this.toggled = false
  },
})
</script>
<style>
.hamburger-line {
  width: 4rem;
  height: 3px;
  margin: 7px 0;
  background-color: white;
}
</style>
