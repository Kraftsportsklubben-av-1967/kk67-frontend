<template>
  <Transition>
    <NavbarMobileOverlay v-if="toggled" @click="toggleOverlay" :navbar-buttons="navbarButtons" />
  </Transition>
  <div class="flex justify-between h-24">
    <KK67Logo />
    <div
      class="block my-auto cursor-pointer duration-500 hamburger-container"
      @click="toggleOverlay"
    >
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
import KK67Logo from '@components/Media/KK67Logo.vue'
import NavbarMobileOverlay from '@components/Navbar/NavbarMobileOverlay.vue'
import { INavbarButton } from './NavbarButton.vue'

export default defineComponent({
  name: 'NavbarMobile',
  components: { KK67Logo, NavbarMobileOverlay },
  emits: ['showNavbarOverlay'],
  props: {
    navbarButtons: {
      type: Array as PropType<Array<INavbarButton>>,
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
  width: 3.25rem;
  height: 3px;
  margin: 7px 0;
  background-color: white;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .hamburger-container:hover {
    @apply opacity-70;
  }
}
</style>
