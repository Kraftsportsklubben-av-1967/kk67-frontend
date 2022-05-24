<template>
  <div>
    <img @click="goToHomepage()" :src="selectLogo()" alt="kk67-logo" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export enum LOGO_TYPES {
  BLACK_LOGO = 'kk-logo-black.png',
  WHITE_LGOO = 'kk-logo-white.png',
  DEFAULT_LOGO = 'kk-logo.png',
}

const ASSETS_URL = '/public/logo/'
export default defineComponent({
  name: 'KK67Logo',
  props: {
    logo: String,
  },
  methods: {
    selectLogo(): string {
      if (this.logo) {
        return ASSETS_URL + this.logo
      }

      if (this.$route.name === 'Home') {
        return ASSETS_URL + LOGO_TYPES.WHITE_LGOO
      }
      return ASSETS_URL + LOGO_TYPES.DEFAULT_LOGO
    },
    goToHomepage() {
      if (this.$route.name === 'Home') this.$router.go(0) //force refresh of content
      else this.$router.push('/')
    },
  },
})
</script>

<style scoped>
img {
  display: block;
  transition-duration: 0.4s;
  width: 4rem;
  image-rendering: pixelated;
}

/* sm */
@media (min-width: 640px) {
  img {
    width: 100%;
  }
}

@media (hover: hover) and (pointer: fine) {
  img:hover {
    cursor: pointer;
    opacity: 0.6;
  }
}
</style>
